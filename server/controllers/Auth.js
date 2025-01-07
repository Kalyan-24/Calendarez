import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import Setting from '../models/Settings.js'
import Token from '../models/Tokens.js'
import User from '../models/Users.js'

import { sendEmail } from '../utils/Email.js'

const postLoginController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    var { usernameoremail } = req.body
    const { password } = req.body

    try {
        let user = await User.findOne({ $or: [{ email: usernameoremail.toLowerCase() }, { username: usernameoremail }] })

        if (user) {

            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

                const settings = await Setting.findOne({ userid: user._id })

                return res
                    .status(200)
                    .cookie('token', token, {
                        httpOnly: true,
                        maxAge: 10 * 24 * 60 * 60 * 1000,
                        sameSite: 'none',
                        secure: true
                    })
                    .json({
                        status: 'Success',
                        message: 'Login Successful!',
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            isverified: user.isverified
                        },
                        settings
                    })
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Invalid Credentials' })
            }
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'Invalid Credentials' })
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

const postRegisterController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { username, email, password } = req.body

    try {
        let user = await User.findOne({ username: username })
        if (!user) {
            user = await User.findOne({ email: email.toLowerCase() })

            if (!user) {
                const hashedPassword = await bcrypt.hash(password, 10)
                user = await User.create({ username: username, email: email.toLowerCase(), password: hashedPassword })

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m', algorithm: 'HS256' })

                await Token.create({ userId: user._id, type: 'verify-account', status: 'Active', token, expiresAt: new Date(Date.now() + 30 * 60 * 1000) })

                sendEmail(user.email, 'Verify your Account', `<body style="height:90%;width:98%;color:#000"><center style="border:1px solid #e8e4e4;border-radius:6px;background-color:#fff;padding:20px 15px;margin-top:10px;font-family:Roboto,sans-serif"><a href="${process.env.CLIENT_URL}"><img src="${process.env.CLIENT_URL}/assets/images/icon.svg" style="width:40px;user-select:none"></a><h1 style="font-weight:500">Account Verification</h1><p style="font-size:14px">Hello <span style="font-weight:800">${user.username}</span>,</p><p style="width:95%;text-align:center;color:#71717a">Only one step left to access <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a> services,simply click the button below to verify your account.</p><a href="${process.env.CLIENT_URL}/verify-account/${token}" style="display:inline-flex;margin:1rem 0;padding-top:.5rem;padding-bottom:.5rem;padding-left:1rem;padding-right:1rem;gap:.5rem;justify-content:center;align-items:center;border-radius:.375rem;font-size:.875rem;line-height:1.25rem;font-weight:500;color:#fff;white-space:nowrap;background-color:#3b82f6;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06);text-decoration:none;user-select:none">Verify my Account</a><p style="width:70%;text-align:center;font-weight:700">This link will expire in 30 minutes.</p><p style="width:70%;text-align:center;color:#71717a;font-size:12px">Note: You're receiving this email because you have an account in <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a>.</p></center></body>`)

                //     const holidays = await Holiday.find({  })

                // scheduleEmail(event._id.toString(), scheduleDate, user.email, 'Event Reminder', `<p>The event "${event.title === '' ? '[Untitled]' : event.title}" is scheduled on ${format(event.date, 'dd MMMM yyyy, EEEE')} at ${event.time}.</p><p><b>Title : </b><span>🏖️ ${event.title || "[Untitled]"} ${event.type === "Birthday" && event.title !== "" && "'s Birthday"}</span></p><p><b>Description : </b><span>${event.description === '' ? '[No Description]' : event.description}</span></p><p><b>Date : </b><span>${format(event.date, 'dd MMMM yyyy, EEEE')}</span></p><p><b>Time : </b><span>${event.time}</span></p><p><b>Host : </b><span>${user.username}</span></p><p style="text-align:center;color:#71717a;font-size:12px">Note: This email is to remaind you about the event which is created by you.</p>`)

                return res.status(200).json({ status: 'Success', message: 'Account created successfully! Please verify your account by clicking the link sent to your email' })
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Email already in use!' })
            }

        }
        else {
            return res.status(200).json({ status: 'Error', error: 'Username already exists!' })
        }
    }
    catch (err) {
        return res.status(500).json({ status: 'Error', error: err.message })
    }
}

const postLogoutController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { token } = req.cookies

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (decodedToken) {
        await Token.create({ userId: decodedToken.id, token, type: 'logout', status: 'Blacklisted', expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) })
    }

    return res.status(200)
        .cookie('token', null, {
            httpOnly: true,
            expires: new Date(Date.now()),
            sameSite: 'none',
            secure: true
        })
        .json({ status: 'Success', message: 'Logged Out Successfully!' })
}

const postSendAuthEmailController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { type } = req.body

    if (type === 'reset-password') {
        try {
            const { email } = req.body
            const user = await User.findOne({ email: email.toLowerCase() })

            if (user) {

                const pastTokens = await Token.find({ userId: user._id, type: 'reset-password', status: 'Active' })

                pastTokens.map(async (pastToken) => {
                    pastToken.status = 'Blacklisted'
                    await pastToken.save()
                })

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m', algorithm: 'HS256' })

                await Token.create({ userId: user._id, type: 'reset-password', status: 'Active', token, expiresAt: new Date(Date.now() + 30 * 60 * 1000) })

                sendEmail(email, 'Reset your Password', `<body style="height:90%;width:98%;color:#000"><center style="border:1px solid #e8e4e4;border-radius:6px;background-color:#fff;padding:20px 15px;margin-top:10px;font-family:Roboto,sans-serif"><a href="${process.env.CLIENT_URL}"><img src="${process.env.CLIENT_URL}/assets/images/icon.svg" style="width:40px;user-select:none"></a><h1 style="font-weight:500">Password Reset</h1><p style="font-size:14px">Hello <span style="font-weight:800">${user.username}</span>,</p><p style="width:95%;text-align:center;color:#71717a">If you've forgot or lost your password for <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a>, click the button below to reset your password.</p><a href="${process.env.CLIENT_URL}/reset-password/${token}" style="display:inline-flex;margin:1rem 0;padding-top:.5rem;padding-bottom:.5rem;padding-left:1rem;padding-right:1rem;gap:.5rem;justify-content:center;align-items:center;border-radius:.375rem;font-size:.875rem;line-height:1.25rem;font-weight:500;color:#fff;white-space:nowrap;background-color:#3b82f6;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06);text-decoration:none;user-select:none">Reset My Password</a><p style="width:70%;text-align:center;font-weight:700">This link will expire in 30 minutes.</p><p style="width:70%;text-align:center;color:#71717a;font-size:12px">Note: If you did not request to reset your password, you can safely ignore this email.</p></center></body>`)
                return res.status(200).json({ status: 'Success', message: 'Password Reset Link Sent!' })
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Invalid Email!' })
            }
        }
        catch (error) {
            return res.status(500).json({ status: 'Error', error: error.message })
        }
    }

    else if (type === 'verify-account') {
        try {
            const { token } = req.cookies
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            const user = await User.findById(decodedToken.id)

            if (user) {
                const pastTokens = await Token.find({ userId: user._id, type: 'verify-account', status: 'Active' })

                pastTokens.map(async (pastToken) => {
                    pastToken.status = 'Blacklisted'
                    await pastToken.save()
                })

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m', algorithm: 'HS256' })

                await Token.create({ userId: user._id, type: 'verify-account', status: 'Active', token, expiresAt: new Date(Date.now() + 30 * 60 * 1000) })

                sendEmail(user.email, 'Verify your Account', `<body style="height:90%;width:98%;color:#000"><center style="border:1px solid #e8e4e4;border-radius:6px;background-color:#fff;padding:20px 15px;margin-top:10px;font-family:Roboto,sans-serif"><a href="${process.env.CLIENT_URL}"><img src="${process.env.CLIENT_URL}/assets/images/icon.svg" style="width:40px;user-select:none"></a><h1 style="font-weight:500">Account Verification</h1><p style="font-size:14px">Hello <span style="font-weight:800">${user.username}</span>,</p><p style="width:95%;text-align:center;color:#71717a">Only one step left to access <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a> services,simply click the button below to verify your account.</p><a href="${process.env.CLIENT_URL}/verify-account/${token}" style="display:inline-flex;margin:1rem 0;padding-top:.5rem;padding-bottom:.5rem;padding-left:1rem;padding-right:1rem;gap:.5rem;justify-content:center;align-items:center;border-radius:.375rem;font-size:.875rem;line-height:1.25rem;font-weight:500;color:#fff;white-space:nowrap;background-color:#3b82f6;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06);text-decoration:none;user-select:none">Verify my Account</a><p style="width:70%;text-align:center;font-weight:700">This link will expire in 30 minutes.</p><p style="width:70%;text-align:center;color:#71717a;font-size:12px">Note: You're receiving this email because you have an account in <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a>.</p></center></body>`)

                return res.status(200).json({ status: 'Success', message: 'Verification link sent to your email successfully!' })
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'User not found!' })
            }
        }
        catch (error) {
            return res.status(200).json({ status: 'Error', error: error.message })
        }
    }
}

const postVerifyTokenController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { token } = req.body

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const blackListToken = await Token.findOne({ token })

        if (blackListToken.status === 'Blacklisted') {
            return res.status(200).json({ status: 'Error', error: 'jwt expired' })
        }

        const user = await User.findById(decodedToken.id)

        if (user) {
            return res.status(200).json({ status: 'Success', message: 'Token Verified!' })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'Invalid Token!' })
        }
    }
    catch (error) {
        return res.status(200).json({ status: 'Error', error: error.message })
    }
}

const postResetPasswordController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { token, password } = req.body

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const blackListToken = await Token.findOne({ token })

        if (blackListToken.status === 'Blacklisted') {
            return res.status(200).json({ status: 'Error', error: 'jwt expired' })
        }
        else if (blackListToken.type !== 'reset-password') {
            return res.status(200).json({ status: 'Error', error: 'Invalid Token!' })
        }

        const user = await User.findById(decodedToken.id)

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                return res.status(200).json({ status: 'Error', error: 'New password cannot be same as old password!' })
            }
            user.password = await bcrypt.hash(password, 10)
            await user.save()

            const pastTokens = await Token.find({ userId: user._id, type: 'reset-password', status: 'Active' })

            pastTokens.map(async (pastToken) => {
                pastToken.status = 'Blacklisted'
                await pastToken.save()
            })


            return res.status(200).json({ status: 'Success', message: 'Password Reset Successfully. Please Login!' })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'Invalid Token!' })
        }
    }
    catch (error) {
        return res.status(200).json({ status: 'Error', error: error.message })
    }
}

const postAccountVerifiedController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { token } = req.body

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const blackListToken = await Token.findOne({ token })

        if (blackListToken.status === 'Blacklisted') {
            return res.status(200).json({ status: 'Error', error: 'jwt expired' })
        }
        else if (blackListToken.type !== 'verify-account') {
            return res.status(200).json({ status: 'Error', error: 'Invalid Token!' })
        }

        const user = await User.findById(decodedToken.id)

        if (user) {
            user.isverified = true
            await user.save()

            const pastTokens = await Token.find({ userId: user._id, type: 'verify-account', status: 'Active' })

            pastTokens.map(async (pastToken) => {
                pastToken.status = 'Blacklisted'
                await pastToken.save()
            })

            return res.status(200).json({ status: 'Success', message: 'Email Verified Successfully. Please Login!' })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'Invalid Token!' })
        }
    }
    catch (error) {
        return res.status(200).json({ status: 'Error', error: error.message })
    }
}

const postChangePasswordController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { oldpassword, newpassword } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            if (await bcrypt.compare(oldpassword, user.password)) {
                user.password = await bcrypt.hash(newpassword, 10)
                await user.save()
                return res.status(200).json({ status: 'Success', message: 'Password changed successfully!' })
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Incorrect old password!' })
            }
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'User not found!' })
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

export { postLoginController, postRegisterController, postLogoutController, postChangePasswordController, postVerifyTokenController, postResetPasswordController, postSendAuthEmailController, postAccountVerifiedController }
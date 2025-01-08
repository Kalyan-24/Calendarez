import jwt from 'jsonwebtoken'

import Holiday from "../models/Holidays.js";
import Setting from "../models/Settings.js";
import Token from "../models/Tokens.js";
import User from "../models/Users.js";

import { sendEmail } from "../utils/Email.js";

const postGetHolidaysController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')
    const { year_1, year_2 } = req.body

    try {
        const holidaysData = await Holiday.find({ $or: [{ Year: year_1 }, { Year: year_2 }] })
        return res.status(200).json({ status: 'Success', data: holidaysData })
    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

const postGetUserController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { userId } = req.body

    if (userId) {
        const user = await User.findById(userId)

        if (user) {
            const settings = await Setting.findOne({ userid: user._id })

            return res.status(200).json({ status: 'Success', user: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname, isverified: user.isverified }, settings })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'User not found!' })
        }
    }
    else {
        const { token } = req.cookies

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            const user = await User.findById(decodedToken.id)

            if (user) {

                const settings = await Setting.findOne({ userid: user._id })

                return res.status(200).json({ status: 'Success', user: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname, isverified: user.isverified }, settings })
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'User not found!' })
            }
        }
        catch (error) {
            return res.status(500).json({ status: 'Error', error: error.message })
        }
    }


}

const postEditProfileController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { username, email, firstname, lastname } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            if (user.username !== username) {
                const existingUser = await User.findOne({ username: username })

                if (existingUser) {
                    return res.status(200).json({ status: 'Error', error: 'Username already exists!' })
                }
                else {
                    if (user.email !== email) {
                        const existingUser = await User.findOne({ email: email.toLowerCase() })

                        if (existingUser) {
                            return res.status(200).json({ status: 'Error', error: 'Email already in use!' })
                        }
                        else {
                            user.username = username
                            user.email = email.toLowerCase()
                            user.firstname = firstname
                            user.lastname = lastname
                            user.isverified = false
                            await user.save()

                            const pastTokens = await Token.find({ userId: user._id, type: 'verify-account', status: 'Active' })

                            pastTokens.map(async (pastToken) => {
                                pastToken.status = 'Blacklisted'
                                await pastToken.save()
                            })

                            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m', algorithm: 'HS256' })

                            await Token.create({ userId: user._id, type: 'verify-account', status: 'Active', token, expiresAt: new Date(Date.now() + 30 * 60 * 1000) })

                            await sendEmail(user.email, 'Verify your Account', `<body style="height:90%;width:98%;color:#000"><center style="border:1px solid #e8e4e4;border-radius:6px;background-color:#fff;padding:20px 15px;margin-top:10px;font-family:Roboto,sans-serif"><a href="${process.env.CLIENT_URL}"><img alt="Calendarez-Logo" src="${process.env.CLIENT_URL}/assets/images/icon.png" style="width:40px;user-select:none"></a><h1 style="font-weight:500">Account Verification</h1><p style="font-size:14px">Hello <span style="font-weight:800">${user.username}</span>,</p><p style="width:95%;text-align:center;color:#71717a">Only one step left to access <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a> services,simply click the button below to verify your account.</p><a href="${process.env.CLIENT_URL}/verify-account/${token}" style="display:inline-flex;margin:1rem 0;padding-top:.5rem;padding-bottom:.5rem;padding-left:1rem;padding-right:1rem;gap:.5rem;justify-content:center;align-items:center;border-radius:.375rem;font-size:.875rem;line-height:1.25rem;font-weight:500;color:#fff;white-space:nowrap;background-color:#3b82f6;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06);text-decoration:none;user-select:none">Verify my Account</a><p style="width:70%;text-align:center;font-weight:700">This link will expire in 30 minutes.</p><p style="width:70%;text-align:center;color:#71717a;font-size:12px">Note: You're receiving this email because you have an account in <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a>.</p></center></body>`)

                            return res.status(200).json({ status: 'Success', message: 'Profile updated successfully! Check your new email to verify your account', user: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname, isverified: user.isverified } })

                        }
                    }
                    else {
                        user.username = username
                        user.firstname = firstname
                        user.lastname = lastname
                        await user.save()
                        return res.status(200).json({ status: 'Success', message: 'Profile updated successfully!', user: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname, isverified: user.isverified } })

                    }
                }
            }
            else if (user.email !== email) {
                const existingUser = await User.findOne({ email: email.toLowerCase() })

                if (existingUser) {
                    return res.status(200).json({ status: 'Error', error: 'Email already in use!' })
                }
                else {
                    user.email = email.toLowerCase()
                    user.firstname = firstname
                    user.lastname = lastname
                    user.isverified = false
                    await user.save()

                    const pastTokens = await Token.find({ userId: user._id, type: 'verify-account', status: 'Active' })

                    pastTokens.map(async (pastToken) => {
                        pastToken.status = 'Blacklisted'
                        await pastToken.save()
                    })

                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m', algorithm: 'HS256' })

                    await Token.create({ userId: user._id, type: 'verify-account', status: 'Active', token, expiresAt: new Date(Date.now() + 30 * 60 * 1000) })

                    await sendEmail(user.email, 'Verify your Account', `<body style="height:90%;width:98%;color:#000"><center style="border:1px solid #e8e4e4;border-radius:6px;background-color:#fff;padding:20px 15px;margin-top:10px;font-family:Roboto,sans-serif"><a href="${process.env.CLIENT_URL}"><img alt="Calendarez-Logo" src="${process.env.CLIENT_URL}/assets/images/icon.png" style="width:40px;user-select:none"></a><h1 style="font-weight:500">Account Verification</h1><p style="font-size:14px">Hello <span style="font-weight:800">${user.username}</span>,</p><p style="width:95%;text-align:center;color:#71717a">Only one step left to access <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a> services,simply click the button below to verify your account.</p><a href="${process.env.CLIENT_URL}/verify-account/${token}" style="display:inline-flex;margin:1rem 0;padding-top:.5rem;padding-bottom:.5rem;padding-left:1rem;padding-right:1rem;gap:.5rem;justify-content:center;align-items:center;border-radius:.375rem;font-size:.875rem;line-height:1.25rem;font-weight:500;color:#fff;white-space:nowrap;background-color:#3b82f6;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.3s;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06);text-decoration:none;user-select:none">Verify my Account</a><p style="width:70%;text-align:center;font-weight:700">This link will expire in 30 minutes.</p><p style="width:70%;text-align:center;color:#71717a;font-size:12px">Note: You're receiving this email because you have an account in <a style="font-weight:700;color:#3b82f6;text-decoration:none" href="${process.env.CLIENT_URL}/">Calendarez</a>.</p></center></body>`)

                    return res.status(200).json({ status: 'Success', message: 'Profile updated successfully! Check your new email to verify your account', user: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname, isverified: user.isverified } })
                }
            }
            else {
                user.firstname = firstname
                user.lastname = lastname
                await user.save()
                return res.status(200).json({ status: 'Success', message: 'Profile updated successfully!', user: { id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname, isverified: user.isverified } })
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

const postCreateSettingsController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')
    const { username } = req.body

    try {
        const user = await User.findOne({ username })

        const setting = await Setting.create({ userid: user._id })

        return res.status(200).json({ status: 'Success', data: setting })
    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

const postEditSettingsController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { showholidays, showevents, showtasks, showbirthdays, holidaycolor, eventcolor, taskcolor, birthdaycolor, holidayremaindertime, holidayremainderformat, eventremaindertime, eventremainderformat, taskremaindertime, taskremainderformat, birthdayremaindertime, birthdayremainderformat } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const settings = await Setting.findOne({ userid: user._id })

            if (!settings.userid.equals(user._id)) {
                return res.status(200).json({ status: 'Error', error: 'Unauthorized!' })
            }

            if (showholidays !== undefined || null) settings.showholidays = showholidays
            if (showevents !== undefined || null) settings.showevents = showevents
            if (showtasks !== undefined || null) settings.showtasks = showtasks
            if (showbirthdays !== undefined || null) settings.showbirthdays = showbirthdays
            if (holidaycolor !== undefined || null) settings.holidaycolor = holidaycolor
            if (eventcolor !== undefined || null) settings.eventcolor = eventcolor
            if (taskcolor !== undefined || null) settings.taskcolor = taskcolor
            if (birthdaycolor !== undefined || null) settings.birthdaycolor = birthdaycolor
            if (holidayremaindertime !== undefined || null) settings.holidayremaindertime = holidayremaindertime
            if (holidayremainderformat !== undefined || null) settings.holidayremainderformat = holidayremainderformat
            if (eventremaindertime !== undefined || null) settings.eventremaindertime = eventremaindertime
            if (eventremainderformat !== undefined || null) settings.eventremainderformat = eventremainderformat
            if (taskremaindertime !== undefined || null) settings.taskremaindertime = taskremaindertime
            if (taskremainderformat !== undefined || null) settings.taskremainderformat = taskremainderformat
            if (birthdayremaindertime !== undefined || null) settings.birthdayremaindertime = birthdayremaindertime
            if (birthdayremainderformat !== undefined || null) settings.birthdayremainderformat = birthdayremainderformat

            await settings.save()

            return res.status(200).json({ status: 'Success', message: 'Settings updated successfully', settings: settings })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'User not found!' })
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

export { postGetHolidaysController, postGetUserController, postEditProfileController, postCreateSettingsController, postEditSettingsController }
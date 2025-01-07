import jwt from 'jsonwebtoken'

import Token from "../models/Tokens.js"
import User from "../models/Users.js"

const isAuthenticated = async (req, res, next) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { token } = req.cookies

    if (!token) {
        return res.status(200).json({
            status: 'Error', error: 'Login to Access!'
        })
    }

    const blackListToken = await Token.findOne({ token })

    if (blackListToken) {
        return res.status(200)
            .cookie('token', null, {
                expires: new Date(Date.now()),
                sameSite: 'none',
                secure: true
            }).json({
                status: 'Error', error: 'Login to Access!'
            })
    }

    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            const user = await User.findById(decoded.id)

            if (user) {
                next()
            }
            else {
                return res
                    .status(200)
                    .cookie('token', null, {
                        expires: new Date(Date.now()),
                        sameSite: 'none',
                        secure: true
                    })
                    .json({ status: 'Error', error: 'Something went wrong. Please login again!' })
            }
        }
        catch (err) {
            return res
                .status(200)
                .cookie('token', null, {
                    expires: new Date(Date.now()),
                    sameSite: 'none',
                    secure: true
                })
                .json({ status: 'Error', error: 'Something went wrong. Please login again!' })
        }
    }
}

export default isAuthenticated
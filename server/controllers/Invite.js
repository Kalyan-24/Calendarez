import jwt from 'jsonwebtoken'

import Event from '../models/Events.js'
import Invite from '../models/Invites.js'
import Setting from '../models/Settings.js'
import User from '../models/Users.js'

const postGetInvitationIdController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { eventid } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const invite = await Invite.findOne({ eventid })

            if (invite) {
                if (!invite.host.id.equals(user._id)) {
                    return res.status(200).json({ status: 'Error', error: 'Unauthorized!' })
                }
                return res.status(200).json({ status: 'Success', invite })
            }
            else {
                const event = await Event.findById(eventid)

                if (event) {
                    const settings = await Setting.findOne({ userid: user._id })
                    const invite = await Invite.create({ host: { id: user._id, username: user.username, email: user.email, profilecolor: settings.profilecolor }, eventid, expiresAt: event.date })

                    return res.status(200).json({ status: 'Success', invite })
                }
                else {
                    return res.status(200).json({ status: 'Error', error: 'Event not found!' })
                }
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

const postGetInvitationDataController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { inviteid } = req.body

    try {

        const invite = await Invite.findById(inviteid)

        if (invite) {
            const event = await Event.findById(invite.eventid)

            return res.status(200).json({ status: 'Success', invite, event })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'Invitation not found!' })
        }

    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

const postRespondToInviteController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { inviteid, value } = req.body

    const { token } = req.cookies

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const invite = await Invite.findById(inviteid)

            if (invite) {
                if (invite.responses.find(response => response.user.id.equals(user._id))) {
                    invite.responses.find(response => response.user.id.equals(user._id)).value = value
                    invite.responses.find(response => response.user.id.equals(user._id)).isEdited = true
                }
                else {
                    const settings = await Setting.findOne({ userid: user._id })
                    invite.responses.push({ user: { id: user._id, username: user.username, email: user.email, profilecolor: settings.profilecolor }, value })
                }

                await invite.save()

                return res.status(200).json({ status: 'Success', message: 'Successfully Responded!', invite })
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Invitation not found!' })
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

const postCommentOnInviteController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { inviteid, comment } = req.body

    const { token } = req.cookies

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const invite = await Invite.findById(inviteid)

            if (invite) {
                if (invite.responses.find(response => response.user.id.equals(user._id))) {
                    invite.responses.find(response => response.user.id.equals(user._id)).comment = comment

                    await invite.save()

                    return res.status(200).json({ status: 'Success', message: 'Successfully Commented!', invite })
                }
                else {
                    return res.status(200).json({ status: 'Error', error: 'Respond to event first!' })
                }
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Invitation not found!' })
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

export { postGetInvitationIdController, postGetInvitationDataController, postRespondToInviteController, postCommentOnInviteController }
import { format, sub } from 'date-fns'
import jwt from 'jsonwebtoken'

import Event from '../models/Events.js'
import Holiday from '../models/Holidays.js'
import Invite from '../models/Invites.js'
import User from '../models/Users.js'

import { scheduleEmail, rescheduleEmail, cancelEmail } from '../utils/Email.js'


const postAddEventController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { title, description, type, date, time, color, remaindertime, remainderformat } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const event = await Event.create({ userid: user._id, title, description, type, date, time, color, remaindertime, remainderformat })
            let scheduleDate
            if (remainderformat === 'minute') {
                scheduleDate = sub(new Date(date), { minutes: remaindertime })
            }
            else if (remainderformat === 'hour') {
                scheduleDate = sub(new Date(date), { hours: remaindertime })
            }
            else {
                scheduleDate = sub(new Date(date), { days: remaindertime })
            }

            let icon
            if (event.type === "Event") {
                icon = "📅"
            }
            else if (event.type === "Task") {
                icon = "📝"
            }
            else {
                icon = "🎂"
            }

            scheduleEmail(event._id.toString(), scheduleDate, user.email, 'Event Reminder', `<p>The event "${event.title === '' ? '[Untitled]' : event.title}" is scheduled on ${format(event.date, 'dd MMMM yyyy, EEEE')} at ${event.time}.</p><p><b>Title : </b><span>${icon} ${event.title || "[Untitled]"} ${event.type === "Birthday" && event.title !== "" && "'s Birthday"}</span></p><p><b>Description : </b><span>${event.description === '' ? '[No Description]' : event.description}</span></p><p><b>Date : </b><span>${format(event.date, 'dd MMMM yyyy, EEEE')}</span></p><p><b>Time : </b><span>${event.time}</span></p><p><b>Host : </b><span>${user.username}</span></p><p style="text-align:center;color:#71717a;font-size:12px">Note: This email is to remaind you about the event which is created by you.</p>`)

            return res.status(200).json({ status: 'Success', message: 'Event added successfully' })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'User not found!' })
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

const postGetEventsController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { year_1, year_2 } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const allEvents = await Event.find({
                userid: user._id,
                $expr: {
                    $or: [
                        { $eq: [{ $year: '$date' }, year_1] },
                        { $eq: [{ $year: '$date' }, year_2] }
                    ]
                }
            }).sort({ date: 1, createdAt: 1 })

            return res.status(200).json({ status: 'Success', events: allEvents })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'User not found!' })
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

const postEditEventController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { eventid, title, description, type, date, time, color, remaindertime, remainderformat } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const event = await Event.findById(eventid)

            if (event) {
                if (!event.userid.equals(user._id)) {
                    return res.status(200).json({ status: 'Error', error: 'Unauthorized!' })
                }
                event.title = title
                event.description = description
                event.type = type
                event.date = date
                event.time = time
                event.color = color
                event.remaindertime = remaindertime
                event.remainderformat = remainderformat

                await event.save()
                let scheduleDate
                if (remainderformat === 'minute') {
                    scheduleDate = sub(new Date(date), { minutes: remaindertime })
                }
                else if (remainderformat === 'hour') {
                    scheduleDate = sub(new Date(date), { hours: remaindertime })
                }
                else {
                    scheduleDate = sub(new Date(date), { days: remaindertime })
                }

                let icon
                if (event.type === "Event") {
                    icon = "📅"
                }
                else if (event.type === "Task") {
                    icon = "📝"
                }
                else {
                    icon = "🎂"
                }

                rescheduleEmail(event._id.toString(), scheduleDate, user.email, 'Event Reminder', `<p>The event "${event.title === '' ? '[Untitled]' : event.title}" is scheduled on ${format(event.date, 'dd MMMM yyyy, EEEE')} at ${event.time}.</p><p><b>Title : </b><span>${icon} ${event.title || "[Untitled]"} ${event.type === "Birthday" && event.title !== "" ? "'s Birthday" : ''}</span></p><p><b>Description : </b><span>${event.description === '' ? '[No Description]' : event.description}</span></p><p><b>Date : </b><span>${format(event.date, 'dd MMMM yyyy, EEEE')}</span></p><p><b>Time : </b><span>${event.time}</span></p><p><b>Host : </b><span>${user.username}</span></p><p style="text-align:center;color:#71717a;font-size:12px">Note: This email is to remaind you about the event which is created by you.</p>`)



                return res.status(200).json({ status: 'Success', message: 'Event updated successfully' })
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Event not found!' })
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

const postDeleteEventController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { eventid } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const event = await Event.findById(eventid)

            if (event) {
                if (!event.userid.equals(user._id)) {
                    return res.status(200).json({ status: 'Error', error: 'Unauthorized!' })
                }
                await event.deleteOne()

                const invite = await Invite.findOne({ eventid: eventid })

                if (invite) {
                    await invite.deleteOne()


                }
                cancelEmail(event._id)
                return res.status(200).json({ status: 'Success', message: 'Event deleted successfully' })

            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Event not found!' })
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

const postTaskCompleteController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { eventid } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        if (user) {
            const event = await Event.findById(eventid)

            if (event) {
                if (!event.userid.equals(user._id)) {
                    return res.status(200).json({ status: 'Error', error: 'Unauthorized!' })
                }
                event.iscompleted = !event.iscompleted

                await event.save()

                if (event.iscompleted) {

                    return res.status(200).json({ status: 'Success', message: 'Marked as completed!' })
                }
                else {
                    return res.status(200).json({ status: 'Success', message: 'Marked as Incomplete!' })
                }
            }
            else {
                return res.status(200).json({ status: 'Error', error: 'Event not found!' })
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

const postSearchController = async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')

    const { query, year } = req.body

    try {
        const { token } = req.cookies

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.id)

        const allMonths = {
            "January": 0,
            "February": 1,
            "March": 2,
            "April": 3,
            "May": 4,
            "June": 5,
            "July": 6,
            "August": 7,
            "September": 8,
            "October": 9,
            "November": 10,
            "December": 11,
        }

        const date = new Date()

        if (user) {
            const holidays = (await Holiday.find({ Name: { $regex: new RegExp(query.split('').join('.*'), 'i') }, Year: year }).sort({ Date: 1, createdAt: 1 })).map(({ _id, Name, Date, Month, Year }) => ({ id: _id, title: Name, date: date.setFullYear(Year, allMonths[Month], Date), time: '12:00 AM', type: 'Holiday' }))
            const events = (await Event.find({ userid: user._id, title: { $regex: new RegExp(query.split('').join('.*'), 'i') }, date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) } }).sort({ date: 1, createdAt: 1 })).map(({ _id, title, date, time, type }) => ({ id: _id, title, date, time, type }))



            return res.status(200).json({ status: 'Success', results: [...holidays, ...events] })
        }
        else {
            return res.status(200).json({ status: 'Error', error: 'User not found!' })
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message })
    }
}

export { postAddEventController, postGetEventsController, postEditEventController, postDeleteEventController, postTaskCompleteController, postSearchController }
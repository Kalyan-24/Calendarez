import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    showholidays: {
        type: Boolean,
        default: true
    },
    showevents: {
        type: Boolean,
        default: true
    },
    showtasks: {
        type: Boolean,
        default: true
    },
    showbirthdays: {
        type: Boolean,
        default: true
    },
    profilecolor: {
        type: String,
        default: function () {
            return ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'][Math.floor(Math.random() * 17)]
        }
    },
    holidaycolor: {
        type: String,
        default: 'orange'
    },
    eventcolor: {
        type: String,
        default: 'blue'
    },
    taskcolor: {
        type: String,
        default: 'emerald'
    },
    birthdaycolor: {
        type: String,
        default: 'red'
    },
    showholidays: {
        type: Boolean,
        default: true
    },
    showevents: {
        type: Boolean,
        default: true
    },
    showtasks: {
        type: Boolean,
        default: true
    },
    showbirthdays: {
        type: Boolean,
        default: true
    },
    holidayremaindertime: {
        type: String,
        default: '30'
    },
    holidayremainderformat: {
        type: String,
        default: 'minute'
    },
    eventremaindertime: {
        type: String,
        default: '30'
    },
    eventremainderformat: {
        type: String,
        default: 'minute'
    },
    taskremaindertime: {
        type: String,
        default: '30'
    },
    taskremainderformat: {
        type: String,
        default: 'minute'
    },
    birthdayremaindertime: {
        type: String,
        default: '30'
    },
    birthdayremainderformat: {
        type: String,
        default: 'minute'
    },
},
    {
        collection: 'Settings'
    }
)

const settingsModel = mongoose.model('Settings', settingsSchema)

export default settingsModel
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    remaindertime: {
        type: Number,
        required: true
    },
    remainderformat: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    iscompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        collection: 'Events'
    }
)

const eventModel = mongoose.model('Event', eventSchema);

export default eventModel
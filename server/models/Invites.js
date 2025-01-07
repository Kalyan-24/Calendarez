import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
    host: {
        type: Object,
        required: true
    },
    eventid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        unique: true
    },
    responses: [{
        user: {
            type: Object,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            default: ''
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isEdited: {
            type: Boolean,
            default: false
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
},
    {
        collection: 'Invites'
    }
);

inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const inviteModel = mongoose.model('Invites', inviteSchema);

export default inviteModel
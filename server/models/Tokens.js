import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    collection: 'Tokens',
})

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const tokenModel = mongoose.model('Tokens', tokenSchema)

export default tokenModel
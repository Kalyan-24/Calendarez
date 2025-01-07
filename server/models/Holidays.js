import mongoose from "mongoose"

const holidaySchema = new mongoose.Schema({
    Date: {
        type: String,
        required: true

    },
    Month: {
        type: String,
        required: true
    },
    Year: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    }
},
    {
        collection: 'Holidays'
    }
)

const holidayModel = mongoose.model('Holidays', holidaySchema)

export default holidayModel
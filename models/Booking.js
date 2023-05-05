const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const bookingSchema = new mongoose.Schema({
    bookingStartDate: {
        type: Date,
        required: true,
    },
    bookingEndDate: {
        type: Date,
        required: true,
    },
    propertyId: [{
        _id: {
            type: ObjectId,
            ref: 'Property',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        }
    }],
    memberId: [{
        type: ObjectId,
        ref: 'Member',
    }],
    paymentId: [{
        type: ObjectId,
        ref: 'Payment',
    }],
    proofPayment: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    accountName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Booking', bookingSchema)
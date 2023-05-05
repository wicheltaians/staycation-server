const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    accountName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Payment', paymentSchema)
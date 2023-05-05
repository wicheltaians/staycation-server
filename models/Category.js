const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    propertyId: [{
        type: ObjectId,
        ref: 'Property',
    }],
})

module.exports = mongoose.model('Category', categorySchema)
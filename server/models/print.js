const mongoose = require('mongoose')


const printSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: 1,
        maxlength: 100
    }
})

const Print =  mongoose.model('Print', printSchema)

module.exports = {Print}
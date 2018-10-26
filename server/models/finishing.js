const mongoose = require('mongoose')


const finishingSchema =  mongoose.Schema({
    name : {
        required: true,
        type: String,
        unique: 1,
        maxlength: 100
    }
})

const Finishing = mongoose.model('Finishing', finishingSchema)

module.exports = {Finishing}
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },

    name:{
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    
    passwordHash:{
        type: String,
        required: true
    },

    icon:{
        type: String
    },

    verified: {
        type: Boolean,
    },

    resetToken: {
        type : String
    },

    tokenExpire: {
        type: Date
    }
})

module.exports = mongoose.model('USER', schema)
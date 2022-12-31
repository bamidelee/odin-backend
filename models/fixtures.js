const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    fixture:{
        type: String,
        required: true
    },

    sport:{
        type: String,
        required: true,
    },

    league:{
        type: String,
        required: true,
    },

    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('FIXTURE', schema)
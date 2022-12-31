const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    table:{
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

module.exports = mongoose.model('TABLE', schema)
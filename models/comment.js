const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },


    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    },

    date: {
        type: Date,
        required: true,
    },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'COMMENT'
        }
    ],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USER'
        }
    ],

    thumbsUp:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USER'
        }
    ],

    hate:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USER'
        }
    ],

    funny:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USER'
        }
    ],

    sad:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USER'
        }
    ]
})

module.exports = mongoose.model('COMMENT', schema)
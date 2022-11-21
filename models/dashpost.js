const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    text:{
        type: String,
       required: true,
    },
    title:{
        type: String,
        required: true,
    },

    primaryMedia: {
        type: String,
        required: true,
    },

     date: {
        type: Date,
        required: true
     },

     type:{
        type: String,
        required: true,
     },

     trending: [
        {
            type: Date,
        }
     ], 

     postID : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
     }
     
})

module.exports = mongoose.model('DASHPOST', schema)
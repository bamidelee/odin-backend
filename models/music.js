const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title:{
        type: String,
       required: true,
    },
    description:{
        type: String,
        required: true,
    },

    primaryMedia:{
        type: String,
        required: true,
    },

    secondaryMedia:[{
        type: String,
    }],
     date: {
        type: Date,
        required: true
     },


     stars:[
        {
            type: String,
            required: true
        }
     ],

     genre: [
        {
            type: String,
            required: true
        }
     ],

     comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'COMMENT'
     }],

     label: {
        type: String,
     }



})

module.exports = mongoose.model('MUSIC', schema)
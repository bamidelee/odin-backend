const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    description:{
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


    secondaryMedia:{
        type: String,
    },
    secondaryMediaType: {
        type: String,
    },

     date: {
        type: Date,
        required: true
     },

     comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'COMMENT'
     }],


     genre: [
        {
            type: String
        }
     ]
     

})

module.exports = mongoose.model('POST', schema)
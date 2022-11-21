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


    secondaryMedia:{
        type: String,
    },
    secondarymediatype: {
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
     

})

module.exports = mongoose.model('POST', schema)
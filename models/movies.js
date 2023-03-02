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

   secondaryMedia:{
      type: String,
   },

   
     date: {
        type: Date,
        required: true
     },

     language: {
        type: String,
        required: true,
     },

     stars:[
        {
            type: String,
            required: true
        }
     ],

     comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'COMMENT'
     }],

     releaseDate: {
         type: Date
     },

     genre: [
      {
         type: String,
         required: true,
      }
     ],

     source: {
      type: String
     },

     country: {
      type: String
     },

     director: {
      type: String
     },

     trailer: {
      type: String
     }

})

module.exports = mongoose.model('MOVIE', schema)
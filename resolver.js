const {UserInputError, AuthenticationError} = require('apollo-server')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
require('dotenv').config()
const JWT_SECRET = process.env.SECRET
const mailjetTransport = require('nodemailer-mailjet-transport');
const nodemailer = require("nodemailer");
const saltRounds = 10
const transporter = nodemailer.createTransport(mailjetTransport({
    auth: {
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET
    }
  }));
const User = require('./models/user')
const Dashpost = require('./models/dashpost')
const Post = require('./models/post')
const Movie = require('./models/movies')
const Music = require('./models/music')
const Series = require('./models/series')
const Comment = require('./models/comment')


const resolvers = {

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
    }),

    Query:{
        findUser: async(root, args) => User.findOne({username: args.username}),

        searchUsers: async(root, args) => {
            const reg = new RegExp(args.username)
            return await User.find({username:{$regex:reg, $options: 'si'}})     
        },

        currentUser: async(root, args, context) => context.currentUser,

        dashPost: async(root,args) => await Post.find({}),

        searchDashpost: async(root, args) => {
            const reg = new RegExp(args.title)
            return await Dashpost.find({title: {$regex: reg, $options: 'si'}})
        },
        
        findPost: async(root, args) =>await Post.findById(args.id)
        .populate('comments'),

        findMovie: async(root, args) => await Movie.findById(args.id)
        .populate('comments'),

        findMusic: async(root, args) => await Music.findById(args.id)
        .populate('comments'),

        findSeries: async(root, args) => await Series.findById(args.id)
        .populate('comments'),

        findComment: async(root, args) => await Comment.findById(args.id)
        .populate('comments')
        .populate('sender')
        .exec(),

        trending: async(root, args) => {
            const d = new Date()
            d.setDate(d.getDate() - 5);
            return await Dashpost.find({trending: d})
        }
    },


    Mutation: {
        resetPassword: async(root, args, context) => {
            const {email} = args
            crypto.randomBytes(32, (err, buffer) =>{
                if(err){
                    console.log(err)
                }
                const token = buffer.toString('hex')
                User.findOne({email})
                .then(user => {
                    if(!user){
                        throw new UserInputError('Email does not belong to any account')
                    }

                    user.resetToken = token
                    user.tokenExpire = Date.now() + 3600000
                    user.save()
                    .then(result => {
                        const link = `http://localhost:3000/reset/${user.resetToken}`
                        transporter.sendMail({
                            to: user.email,
                            from: 'naijaodin@gmail.com',
                            subject: 'Password reset',
                            text: `Hi ${user.username} \n 
                            Please click on the following link ${link} to reset your password. \n\n 
                            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                            html: `<h1> Hi ${user.username}</h1>
                            <h5>  Please click on the following <a href = ${link}> link </a> to reset your password. <br>
                            If you did not request this, please ignore this email and your password will remain unchanged.</h5>`
                            
                        })

                        return user
                    })
                })
            })
        },

        passwordChange: async(root, args) => {
            const { password, resetToken} = args
            const user = await User.findOne({resetToken})

            if(!user){
                throw new AuthenticationError('authentication error')
            }
            if(user.tokenExpire < this.Date.now()){
                throw new UserInputError('link expired')
            }

            const passwordHash = await bcrypt.hash(password, saltRounds)
            user.passwordHash = passwordHash

            try{ 
                 await user.save()
            }
             
              catch(error)  {
                  throw new UserInputError(error.messages,{
                      invalidArgs: args
                  })
              }
              return user
        },

        signUp: async(root,args) => {
            const existingUser = await User.findOne({username: args.username})
            if(existingUser){
                throw new UserInputError('Username taken')
            }
            const {username, password, name, email} = args
            const passwordHash = await bcrypt.hash(password, saltRounds)
           
            const user = new User({
                username,
                passwordHash,
                name,
                email
            })

            try{  
                await user.save()
            }
           
            catch(error)  {
                throw new UserInputError(error.messages,{
                    invalidArgs: args
                })
            }
            return user
        },

        signIn: async(root, args) => {
            const user = await User.findOne({username: args.username})
            const passwordCorrect = user === null? false
            : await bcrypt.compare(args.password, user.passwordHash) 
            if(!(user && passwordCorrect)){
                throw new UserInputError('User not found')
            }

            const userForToken = {
                username: user.username,
                id: user._id
            }
            return{value: jwt.sign(userForToken, JWT_SECRET)}
        },

        createPost: async(root, args, context) => {
            const { text,title, primaryMedia, secondaryMedia, secondaryMediaType} = args
           
            const post = new Post({
                text,
                title,
                primaryMedia,
                secondaryMedia,
                secondaryMediaType,
                date: new Date()
            })

            const verifiedUser = context.currentUser.verified
            if(!verifiedUser){
                throw new AuthenticationError('access denied')
            }

            try{
                await post.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}

            const dashpost = new Dashpost({
                text,
                title,
                primaryMedia,
                date: new Date(),
                type: 'post',
                postId: post._id
                
            })

            try{
                await dashpost.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}

            return post
        },

        createMovie: async(root, args, context) => {
            const { description, title, primaryMedia, secondaryMedia, language, stars, releaseDate, genre, source, country, director} = args
            const movie = new Movie({
                description, 
                title,
                primaryMedia, 
                secondaryMedia, 
                language, 
                stars, 
                releaseDate, 
                genre, 
                source, 
                country, 
                director, 
                date: new Date()
            })

            const verifiedUser = context.currentUser.verified
            if(!verifiedUser){
                throw new AuthenticationError('access denied')
            }

            try{
                await movie.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}

            const dashpost = new Dashpost({
                text,
                title,
                primaryMedia,
                date: new Date(),
                type: 'movie',
                postId: movie._id
                
            })

            try{
                await dashpost.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}
            
            return movie
        },

        createMusic: async(root, args) => {

            const{ title, primaryMedia, secondaryMedia, stars, genre, label} = args

            const music = new Music({
                title, 
                primaryMedia, 
                secondaryMedia, 
                stars, 
                genre, 
                label,
                date: new Date()
            })

            const verifiedUser = context.currentUser.verified
            if(!verifiedUser){
                throw new AuthenticationError('access denied')
            }

            try{
                await music.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}

            const dashpost = new Dashpost({
                text,
                title,
                primaryMedia,
                date: new Date(),
                type: 'music',
                postId: music._id
                
            })

            try{
                await dashpost.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}
            
            return music
        },

        createSeries: async(root, args, context) => {
            
            const {description, title, primaryMedia, secondaryMedia, language, stars, releaseDate, genre, source, season, episode, next, previous, country, director, episodeTitle} = args

            const series = new Series({
                description, 
                title, 
                primaryMedia, 
                secondaryMedia, 
                language, stars, 
                releaseDate, 
                genre, 
                source, 
                season, 
                episode, 
                next, 
                previous, 
                country, 
                director, 
                episodeTitle,
                date: new Date()
            })

            const verifiedUser = context.currentUser.verified
            if(!verifiedUser){
                throw new AuthenticationError('access denied')
            }

            try{
                await series.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}

            const dashpost = new Dashpost({
                text,
                title,
                primaryMedia,
                date: new Date(),
                type: 'series',
                postId: series._id
                
            })

            try{
                await dashpost.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}
            
            return series
        },

        createComment: async(root, args, context) => {
            
            const {text, postID, postType} = args

            const currentUser = context.currentUser

            if(!currentUser){
                throw new AuthenticationError('Not logged in')
            }

            const comment = new Comment({
                text,
                date: new Date(), 
                sender: currentUser._id
            })

            try{
                await comment.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}

            let post;

            if(postType ==='movie'){

                post = await Movie.findById(postID)
            }
            else if(postType === 'music'){

                post = await Music.findById(postID)
            }
            else if(postType === 'post'){

                post = await Post.findById(postID)
            }

            else if( postType === 'series'){

                post = await Series.findById(postID)
            }
            else if( postType === 'comment'){

                post = await Comment.findById(postID)
            }
            else{
                throw new UserInputError('Invalid post type')
            }

            post.comments = post.comments.concat(comment._id)

              try{
                await post.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}

            return comment
        },

        like: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new AuthenticationError('Not logged in')
            }
            comment.likes = comment.likes.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new UserInputError(error.message)
            }

            return comment
        },

        hate: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new AuthenticationError('Not logged in')
            }
            comment.hate = comment.hate.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new UserInputError(error.message)
            }

            return comment
        },

        thumbsUp: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new AuthenticationError('Not logged in')
            }
            comment.thumbsUp = comment.thumbsUp.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new UserInputError(error.message)
            }

            return comment
        },

        funny: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new AuthenticationError('Not logged in')
            }
            comment.funny = comment.funny.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new UserInputError(error.message)
            }

            return comment
        },

        sad: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new AuthenticationError('Not logged in')
            }
            comment.sad = comment.sad.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new UserInputError(error.message)
            }

            return comment
        },
        
        
    },

}

module.exports = resolvers
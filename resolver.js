const { GraphQLError } = require('graphql');
const { GraphQLScalarType, Kind } = require('graphql');
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
const Table = require('./models/table')
const Fixture = require('./models/fixtures')


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
        latestMovies: async(roor, args) => await Movie.find({}).sort({_id: -1}).skip( parseInt(args.pageNumber) > 0 ? ( ( parseInt(args.pageNumber) - 1 ) * 10 ) : 0 ).limit(10),
        relatedPost: async(roots, args) => await Post.find({genre: args.genre}).sort({_id: -1}).limit(6),
        dashNews: async(root, args) => await Post.find({genre: args.genre}).sort({_id: -1}).limit(6),
        newsPage: async(root, args) => await Dashpost.find({genre: args.genre, type: args.type}).sort({_id: -1}).skip( parseInt(args.pageNumber) > 0 ? ( ( parseInt(args.pageNumber) - 1 ) * 10 ) : 0 ).limit(10),
        pageCount: async(root, args) =>  {
           const count = await Dashpost.find({genre: args.genre, type: args.type}).count()
           return {count: count}
        },
        latestMoviesCount: async(root, args) => {
            const count = await Dashpost.find({type: 'movie'}).count()
            return {count: count}
        },
        relatedPost: async(roots, args) => await Post.find({genre: args.genre}).sort({_id: -1}).limit(6),
        tables: async(root, args) => await Table.find({}),
        fixtures: async(root, args) => await Fixture.find({}),
        findUser: async(root, args) => await User.findOne({username: args.username}),

        searchUsers: async(root, args) => {
            const reg = new RegExp(args.username)
            return await User.find({username:{$regex:reg, $options: 'si'}})     
        },

        currentUser: async(root, args, context) => {
            const decodedToken = jwt.verify(context.token, JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return currentUser
        },

        dashPost: async(root,args) => await Dashpost.find({}),

        searchDashpost: async(root, args) => {
            const reg = new RegExp(args.title)
            return await Dashpost.find({title: {$regex: reg, $options: 'si'}})
        },
        
        findPost: async(root, args) =>await Post.findById(args.id)
         .populate({path:'comments', populate:{path: 'sender'}})
         .populate({path:'comments', populate:{path: 'likes'}})
         .populate({path:'comments', populate:{path: 'thumbsUp'}})
         .populate({path:'comments', populate:{path: 'hate'}})
         .populate({path:'comments', populate:{path: 'sad'}})
         .populate({path:'comments', populate:{path: 'funny'}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'sender'}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'likes'}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'thumbsUp'}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'hate'}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'sad'}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'funny'}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sender'}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'likes'}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'thumbsUp'}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'hate'}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sad'}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'funny'}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sender'}}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'likes'}}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'thumbsUp'}}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'hate'}}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sad'}}}}})
         .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'funny'}}}}})
         .exec(),

        findMovie: async(root, args) => await Movie.findById(args.id)
        .populate({path:'comments', populate:{path: 'sender'}})
        .populate({path:'comments', populate:{path: 'likes'}})
        .populate({path:'comments', populate:{path: 'thumbsUp'}})
        .populate({path:'comments', populate:{path: 'hate'}})
        .populate({path:'comments', populate:{path: 'sad'}})
        .populate({path:'comments', populate:{path: 'funny'}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'sender'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'likes'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'thumbsUp'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'hate'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'sad'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'funny'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sender'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'likes'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'thumbsUp'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'hate'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sad'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'funny'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sender'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'likes'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'thumbsUp'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'hate'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sad'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'funny'}}}}})
        .exec(),

        findMusic: async(root, args) => await Music.findById(args.id)
        .populate({path:'comments', populate:{path: 'sender'}})
        .populate({path:'comments', populate:{path: 'likes'}})
        .populate({path:'comments', populate:{path: 'thumbsUp'}})
        .populate({path:'comments', populate:{path: 'hate'}})
        .populate({path:'comments', populate:{path: 'sad'}})
        .populate({path:'comments', populate:{path: 'funny'}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'sender'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'likes'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'thumbsUp'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'hate'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'sad'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'funny'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sender'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'likes'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'thumbsUp'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'hate'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sad'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'funny'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sender'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'likes'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'thumbsUp'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'hate'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sad'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'funny'}}}}})
        .exec(),

        findSeries: async(root, args) => await Series.findById(args.id)
        .populate({path:'comments', populate:{path: 'sender'}})
        .populate({path:'comments', populate:{path: 'likes'}})
        .populate({path:'comments', populate:{path: 'thumbsUp'}})
        .populate({path:'comments', populate:{path: 'hate'}})
        .populate({path:'comments', populate:{path: 'sad'}})
        .populate({path:'comments', populate:{path: 'funny'}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'sender'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'likes'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'thumbsUp'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'hate'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'sad'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'funny'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sender'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'likes'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'thumbsUp'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'hate'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sad'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'funny'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sender'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'likes'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'thumbsUp'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'hate'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sad'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'funny'}}}}})
        .exec(),

        findComment: async(root, args) => await Comment.findById(args.id)
        .populate({path:'comments', populate:{path: 'sender'}})
        .populate({path:'comments', populate:{path: 'likes'}})
        .populate({path:'comments', populate:{path: 'thumbsUp'}})
        .populate({path:'comments', populate:{path: 'hate'}})
        .populate({path:'comments', populate:{path: 'sad'}})
        .populate({path:'comments', populate:{path: 'funny'}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'sender'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'likes'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'thumbsUp'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'hate'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'sad'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'funny'}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sender'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'likes'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'thumbsUp'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'hate'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'sad'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'funny'}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sender'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'likes'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'thumbsUp'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'hate'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'sad'}}}}})
        .populate({path:'comments', populate:{path:'comments', populate:{path:'comments', populate:{path: 'comments', populate:{path:'funny'}}}}})
        .exec(),

        trending: async(root, args) => {
            const d = new Date()
            const y = d.setDate(d.getDate() - 1);
            const t = d.setDate(d.getDate() - 2);
            return await Dashpost.find({trending: {  $gte: new Date(new Date().setDate(new Date().getDate()-5))
            }})
        }
    },


    Mutation: {
        createTable: async(root, args, context) => {
            const {table, league, sport} = args

            const TABLE= new Table({
                league,
                table,
                sport,
                date: new Date()
            })

            const decodedToken = jwt.verify(context.token, JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            const verifiedUser = currentUser.verified

            if(!verifiedUser){
                throw new GraphQLError('Not verified', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }

            const existingTable = await Table.findOne({league})

            if(existingTable){
                existingTable.table = table
                existingTable.date = new Date()
                await existingTable.save()

                return existingTable
            }

            await TABLE.save()
            return TABLE
        },

        createFixture: async(root, args, context) => {
            const {fixture, league, sport} = args

            const FIXTURE= new Fixture({
                league,
                fixture,
                sport,
                date: new Date()
            })

            const decodedToken = jwt.verify(context.token, JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            const verifiedUser = currentUser.verified

            if(!verifiedUser){
                throw new GraphQLError('Not verified', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }

            const existingFixture = await Fixture.findOne({league})

            if(existingFixture){
                existingFixture.fixture = fixture
                existingFixture.date = new Date()
                await existingFixture.save()

                return existingFixture
            }

            await FIXTURE.save()
            return FIXTURE
        },
        resetPassword: async(root, args, context) => {
            const {email} = args
            const user = await User.findOne({email})
            if(!user){
                throw new GraphQLError('Email does not belong to an account', {
                    extensions: { code: 'BAD_USER_INPUT' },
                  });
            }
            crypto.randomBytes(32, async (err, buffer) =>{
                if(err){
                    console.log(err)
                }
                const token = buffer.toString('hex')
              
                    user.resetToken = token
                    user.tokenExpire = Date.now() + 3600000
                    
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
                       
            })
            await user.save()
            return user
        },

        passwordChange: async(root, args) => {
            const { password, resetToken} = args
            const user = await User.findOne({resetToken})

            if(!user){
                throw new GraphQLError('Unauthorized', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }
            if(user.tokenExpire < this.Date.now()){
                throw new GraphQLError('Token expired', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }

            const passwordHash = await bcrypt.hash(password, saltRounds)
            user.passwordHash = passwordHash

            try{ 
                 await user.save()
            }
             
              catch(error)  {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
              }

              const userForToken = {
                username: user.username,
                id: user._id
            }
            return{value: jwt.sign(userForToken, JWT_SECRET)}
           
        },

        signUp: async(root,args) => {
            const existingUser = await User.findOne({username: args.username})
            if(existingUser){
                throw new GraphQLError('Username taken', {
                    extensions: { code: 'BAD_USER_INPUT' },
                  });
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
                throw new GraphQLError('Unable to save to server', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }
            const userForToken = {
                username: user.username,
                id: user._id
            }
            return{value: jwt.sign(userForToken, JWT_SECRET)}
        },

        signIn: async(root, args) => {
            const user = await User.findOne({username: args.username})
            const passwordCorrect = user === null? false
            : await bcrypt.compare(args.password, user.passwordHash) 
            if(!(user && passwordCorrect)){
                throw new GraphQLError('User not found', {
                    extensions: { code: 'BAD_USER_INPUT' },
                  });
            }

            const userForToken = {
                username: user.username,
                id: user._id
            }
            return{value: jwt.sign(userForToken, JWT_SECRET)}
        },

        createPost: async(root, args, context) => {
            const { description,title, primaryMedia, secondaryMedia, secondaryMediaType, genre} = args
           
            const post = new Post({
                description,
                title,
                primaryMedia,
                secondaryMedia,
                secondaryMediaType,
                date: new Date(),
                genre
            })

            const decodedToken = jwt.verify(context.token, JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            const verifiedUser = currentUser.verified
            if(!verifiedUser){
                throw new GraphQLError('Not verified', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }

            try{
                await post.save()
            }
            catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            const dashpost = new Dashpost({
                description,
                title,
                primaryMedia,
                date: new Date(),
                type: 'post',
                postID: post._id,
                genre
                
            })

            try{
                await dashpost.save()
            }
            catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            return post
        },

        createMovie: async(root, args, context) => {
            const { description, title, primaryMedia, secondaryMedia, language, stars, releaseDate, genre, source, country, director, trailer} = args
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
                trailer, 
                date: new Date()
            })

            const decodedToken = jwt.verify(context.token, JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            const verifiedUser = currentUser.verified
            if(!verifiedUser){
                throw new GraphQLError('Not verified', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }

            try{
                await movie.save()
            }
            catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            const dashpost = new Dashpost({
                description,
                title,
                primaryMedia,
                date: new Date(),
                type: 'movie',
                postID: movie._id,
                genre
                
            })

            try{
                await dashpost.save()
            }
            catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }
            
            return movie
        },

        createMusic: async(root, args, context) => {

            const{description, title, primaryMedia, secondaryMedia, stars, genre, label, album, trackNumber} = args
            const prioNumber = Number(trackNumber) -1
            const prio = await Music.findOne({$and: [{album, trackNumber: prioNumber.toString()}]})
            const music = new Music({
                title, 
                description,
                primaryMedia, 
                secondaryMedia, 
                stars, 
                genre, 
                label,
                album,
                trackNumber,
                date: new Date()
            })

            if(prio){
              music.previous = prio._id

            }

            const decodedToken = jwt.verify(context.token, JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            const verifiedUser = currentUser.verified
            if(!verifiedUser){
                throw new GraphQLError('Not verified', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  })
            }

            try{
              await music.save()
            }
            catch (error) {throw new UserInputError(error.message, {
                invalidArgs: args
            })}

            if(prio){
                prio.next = music._id

                try{
                    await prio.save()
                }
                catch (error) {
                    throw new GraphQLError(error.message, {
                        extensions: { code: 'INTERNAL_SERVER_ERROR' },
                      });
                }
            }

            const dashpost = new Dashpost({
                description,
                title,
                primaryMedia,
                date: new Date(),
                type: 'music',
                postID: music._id,
                genre
                
            })

            try{
                await dashpost.save()
            }
            catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }
            
            return music
        },

        createSeries: async(root, args, context) => {
            
            const {description, title, primaryMedia, secondaryMedia, language, stars, releaseDate, genre, source, season, episode, next, previous, country, director, episodeTitle, trailer} = args
            const prioNumber = parseInt(episode) - 1
            const prio = await Series.findOne({ $and: [{title}, { episode: prioNumber.toString()}, {season} ]})
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
                trailer,
                date: new Date()
            })

            if(prio){
                series.previous = prio._id
            }

            const decodedToken = jwt.verify(context.token, JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            const verifiedUser = currentUser.verified
            if(!verifiedUser){
                throw new GraphQLError('Not verified', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }

            try{
                await series.save()
            }
            catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            if(prio){
                prio.next = series._id

                try{
                    await prio.save()
                }
                catch (error) {
                    throw new GraphQLError(error.message, {
                        extensions: { code: 'INTERNAL_SERVER_ERROR' },
                      });
                }
            }

            const dashpost = new Dashpost({
                description,
                title,
                primaryMedia,
                date: new Date(),
                type: 'series',
                postID: series._id,
                genre
                
            })

            try{
                await dashpost.save()
            }
            catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }
            
            return series
        },

        createComment: async(root, args, context) => {
            
            const {text, postID, postType} = args

            const currentUser = context.currentUser

            if(!currentUser){
                throw new GraphQLError('Not logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }

            const comment = new Comment({
                text,
                date: new Date(), 
                sender: currentUser._id
            })

            try{
                await comment.save()
            }
            catch (error) {throw new GraphQLError(error.message, {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
              });}

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
                throw new GraphQLError('Ivalid post type', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            post.comments = post.comments.concat(comment._id)

              try{
                await post.save()
            }
            catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            const dashpost = Dashpost.findOne({postID})
            dashpost.trending = dashpost.trending.concat(new Date())

            return comment
        },

        like: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new GraphQLError('Not logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }
            comment.likes = comment.likes.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            return comment
        },

        hate: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new GraphQLError('Not logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }
            comment.hate = comment.hate.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            return comment
        },

        thumbsUp: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new GraphQLError('Not logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }
            comment.thumbsUp = comment.thumbsUp.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            return comment
        },

        funny: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new GraphQLError('Not logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }
            comment.funny = comment.funny.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            return comment
        },

        sad: async(root, args, context) => {

            const {id} = args
            const comment =await Comment.findById(id)

            const currentUser = context.currentUser

            if(!currentUser){
                throw new GraphQLError('Not logged in', {
                    extensions: { code: 'UNAUTHENTICATED' },
                  });
            }
            comment.sad = comment.sad.concat(currentUser._id)
           try  {
                await comment.save()
            }
            catch(error){
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            return comment
        },
        
        createTrend: async(root, args) => {
            const {id} = args
            const dashpost = await Dashpost.findOne({postID : id})
            dashpost.trending.push(new Date())

            try  {
                await dashpost.save()
            }
            catch(error){
                throw new GraphQLError(error.message, {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  });
            }

            return dashpost

        }
    },

}

module.exports = resolvers
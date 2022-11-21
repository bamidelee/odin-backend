const {gql} = require('apollo-server')

const typeDefs = gql`
    type User {
        username: String!
        name: String!
        email: String!
        passwordHash: String!
        _id : ID
        icon: String
        verified: Boolean
        resetToken: String
        tokenExpire: Date
    }

    type Comment {
        text: String!
        sender: User
        _id: ID!
        comments:[Comment]
        date: Date!
        likes: [User]
        thumbsUp: [User]
        hate: [User]
        sad: [User]
        funny: [User]
    }

    type Post {
        text : String!
        title: String!
        date: Date!
        _id: ID!
        primaryMedia: String!
        secondaryMedia: String
        secondaryMediaType: String
        comments: [Comment]
    }

    type Dashpost {
        text: String!
        title: String!
        primaryMedia: String!
        date: Date!
        type: String!
        trending: [Date]
        postID: ID!
        _id : ID
    }

    type Movie {
        title: String!
        description: String!
        primaryMedia: String!
        secondaryMedia: String
        date: Date!
        language: String!
        stars: [String!]
        comments: Comment
        releaseDate: String
        genre: [String]
        source: String
        _id : ID
        country: String
        director: String
    }

    type Music {
        title: String!
        description: String!
        primaryMedia: String!
        secondaryMedia: String
        date: Date!
        stars: [String]
        comments:[Comment]
        label: String
        _id : ID
    }

    type Series {
        title: String!
        description: String!
        primaryMedia: String!
        secondaryMedia: String
        date: Date!
        language: String!
        stars: [String!]
        comments: Comment
        releaseDate: String
        genre: [String]
        season: String!
        episode:String!
        episodeTitle: String!
        source: String
        next: Series
        previous: Series
        _id : ID
        country: String
        director: String
    }
    type Token {
        value: String!
    }

    type Query {
        findUser(username: String): User
        searchUsers(username:String): [User]
        currentUser: User
        searchDashpost(title: String): [Dashpost]
        dashPost: [Dashpost]
        findPost(id: ID): Post
        findMovie(id: ID): Movie
        findMusic(id: ID) : Music
        findSeries(id: ID) : Series
        trending:[ Dashpost]
        findComment: Comment
    }

    type Mutation {
        resetPassword(email: String): User

        passwordChange(
            password: String
            resetToken: String
        ) : User

        signUp(
            name: String!
            email: String!
            username: String!
            password: String!
        ): User

        signIn(
            username: String!
            password: String!
        ): Token

        createPost(
            text: String!
            title: String!
            primaryMedia: String!
            secondaryMedia: String
            secondaryMediaType: String
            date: Date!
        ): Post

        createDashPost(
            text: String!
            title: String!
            primaryMedia: String!
            date: Date!
            type: String!
            postId: ID
        ): Dashpost

        createMovie(
            description: String!
            title: String!
            primaryMedia: String!
            secondaryMedia: String!
            date: Date!
            language: String!
            stars: [String]
            releaseDate: String
            genre: [String]
            source: String
            country: String
            director: String
        ): Movie

        createMusic(
            title: String!
            primaryMedia: String!
            secondaryMedia: [String]
            date: Date!
            stars: [String]
            genre: [String]
            label: String
        ): Music

        createSeries(
            description: String!
            title: String!
            primaryMedia: String!
            secondaryMedia: String!
            date: Date!
            language: String!
            stars: [String]
            releaseDate: String
            genre: [String]
            source: String
            season: String!
            episode: String!
            episodeTitle: String!
            next: ID
            previous: ID
            country: String
            director: String
        ): Series

        createComment(
            text: String!
            date: Date!
            sender: ID!
            postID: ID!
            postType: String!
        ): Comment

        like(
            id: ID! 
        ): Comment

        thumbsUp(
            id: ID!
        ): Comment

        hate(
            id: ID!
        ): Comment

        funny(
            id: ID!
        ): Comment

        sad(
            id: ID!
        ): Comment


        profile(
            icon: String
            bio: String
            name: String
        ): User

    }

    scalar Date
    
type MyType {
    created: Date
}

`

module.exports = typeDefs
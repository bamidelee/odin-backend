const gql = require('graphql-tag')

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
        text: String
        sender: User
        _id: ID
        comments:[Comment]
        date: Date
        likes: [User]
        thumbsUp: [User]
        hate: [User]
        sad: [User]
        funny: [User]
    }

    type Post {
        description : String!
        title: String!
        date: Date!
        _id: ID!
        primaryMedia: String!
        secondaryMedia: String
        secondaryMediaType: String
        comments: [Comment]
        genre: [String]
    }

    type Dashpost {
        description: String!
        title: String!
        primaryMedia: String!
        date: Date!
        type: String!
        trending: [Date]
        postID: ID!
        _id : ID
        genre: [String]
    }

    type Movie {
        title: String!
        description: String!
        primaryMedia: String!
        secondaryMedia: String
        date: Date!
        language: String!
        stars: [String!]
        comments: [Comment]
        releaseDate: Date
        genre: [String]
        source: String
        _id : ID
        country: String
        director: String
        trailer: String
    }

    type Music {
        title: String!
        description: String!
        primaryMedia: String!
        secondaryMedia: String!
        date: Date!
        stars: [String!]
        comments:[Comment]
        label: String
        _id : ID
        album: String
        trackNumber: String
        next: ID
        previous: ID
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
        releaseDate: Date
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
        trailer: String
    }
    type Token {
        value: String!
    }

    type Table{
        table: String!
        sport: String!
        league: String!
        date: Date!
    }

    type Fixture{
        fixture: String!
        sport: String!
        league: String!
        date: Date!
    }

    type Count{
        n : Int
        count: Int
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
        trending(type: String):[ Dashpost]
        findComment: Comment
        tables: [Table]
        fixtures:[Fixture]
        dashNews(genre: String):[Post]
        newsPage(
            genre: String
            pageNumber: String
            type: String
            ): [Dashpost]
            pageCount(
                genre: String
                type: String
                ): Count
        relatedPost(genre: String): [Post]
        latestMovies( pageNumber: String): [Dashpost]
        latestSeries( pageNumber: String): [Dashpost]
        latestMoviesCount: Count
    }

    type Mutation {
        resetPassword(email: String!): User

        passwordChange(
            password: String
            resetToken: String
        ) : Token

        signUp(
            name: String!
            email: String!
            username: String!
            password: String!
        ): Token

        signIn(
            username: String!
            password: String!
        ): Token

        createPost(
            description: String!
            title: String!
            primaryMedia: String!
            secondaryMedia: String
            secondaryMediaType: String
            genre: [String!]
        ): Post

        createMovie(
            description: String!
            title: String!
            primaryMedia: String!
            secondaryMedia: String!
            language: String!
            stars: [String!]
            releaseDate: Date!
            genre: [String!]
            source: String
            country: String!
            director: String
            trailer: String
        ): Movie

        createMusic(
            title: String!
            description: String!
            primaryMedia: String!
            secondaryMedia: String!
            stars: [String!]
            genre: [String!]
            label: String
            album: String
            trackNumber: String
        ): Music

        createSeries(
            description: String!
            title: String!
            primaryMedia: String!
            secondaryMedia: String!
            language: String!
            stars: [String!]
            releaseDate: Date!
            genre: [String!]
            source: String
            season: String!
            episode: String!
            episodeTitle: String
            country: String!
            director: String
            trailer: String
        ): Series

        createComment(
            text: String!
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

        createTrend(
            id: ID!
        ):Dashpost

        createTable(
            table: String!
            sport: String!
            league: String!
        ):Table

        createFixture(
            fixture: String!
            sport: String!
            league: String!
        ): Fixture

    }

    scalar Date
    
type MyType {
    created: Date
}

`

module.exports = typeDefs
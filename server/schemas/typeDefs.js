const { gql } = require("apollo-server-express");

const typeDefs = gql`
  input MovieInput {
<<<<<<< HEAD
    authors: [String]
    description: String
    title: String!
    movieId: String!
    image: String
=======
    director: [String]
    plot: String
    title: String!
    movieId: String!
    poster: String
>>>>>>> 27e7b51 (updated book to movie)
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    movieCount: Int
    savedMovies: [Movie]
  }

  type Movie {
    movieId: ID!
<<<<<<< HEAD
    authors: [String]
    description: String
=======
    director: [String]
    plot: String
>>>>>>> 27e7b51 (updated book to movie)
    title: String!
    poster: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveMovie(movieToSave: MovieInput!): User
    removeMovie(movieId: String!): User
  }
`;

module.exports = typeDefs;
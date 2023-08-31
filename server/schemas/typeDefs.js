const { gql } = require("apollo-server-express");

const typeDefs = gql`

  type User {
    _id: ID!
    username: String!
    email: String!
    movieCount: Int
    savedMovies: [Movie]
  }

  type Movie {
    movieId: ID!
    directors: [String]
    plot: String
    title: String!
    poster: String
    link: String
  }

  input MovieInput {
    directors: [String]
    plot: String
    title: String!
    movieId: String!
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
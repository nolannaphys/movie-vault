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
    movieId: String
    director: [String]
    plot: String
    title: String!
    poster: String
    
  }

  input MovieInput {
    movieId: String!
    director: [String]
    plot: String
    title: String!
    poster: String
    
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
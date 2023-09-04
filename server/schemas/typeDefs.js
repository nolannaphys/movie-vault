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
    movieId: ID
    director: [String]
    plot: String
    title: String!
    poster: String
    
  }

  input MovieInput {
    movieId: ID
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
    removeMovie(movieId: ID): User
  }
`;

module.exports = typeDefs;
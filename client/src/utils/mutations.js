import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        movieCount
        savedMovies {
          authors
          movieId
          description
          image
          link
          title
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        movieCount
        savedMovies {
          authors
          movieId
          description
          image
          link
          title
        }
      }
    }
  }
`;

export const SAVE_MOVIE = gql`
  mutation saveMovie($movieToSave: MovieInput!) {
    saveMovie(movieToSave: $movieToSave) {
        _id
        username
        email
        movieCount
        savedMovies {
          movieId
          authors
          description
          title
          image
          link
        }
    }
  }
`;

export const REMOVE_MOVIE = gql`
  mutation removeMovie($movieId: String!) {
    removeMovie(movieId: $movieId) {
      _id
      username
      email
      movieCount
      savedMovies {
        movieId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
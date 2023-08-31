import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      movieCount
      email
      savedMovies {
        directors
        movieId
        plot
        poster
        link
        title
      }
      username
    }
  }
`;
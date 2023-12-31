import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      movieCount
      email
      savedMovies {
        movieId
        director
        plot
        poster
        title
      }
      username
    }
  }
`;
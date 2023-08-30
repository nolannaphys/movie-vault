import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      movieCount
      email
      savedMovies {
        authors
        movieId
        description
        image
        link
        title
      }
      username
    }
  }
`;
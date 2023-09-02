import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeMovieId } from '../utils/localStorage';
import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_MOVIE } from "../utils/mutations";
import { GET_ME } from '../utils/queries';

const SavedMovies = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeMovie] = useMutation(REMOVE_MOVIE);
  const userData = data?.me;

  // create function that accepts the movie's mongo _id value as param and deletes the movie from the database
  const handleDeleteMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await removeMovie({
        variables: {
          movieId: movieId
        },
      });

      if (!response.data) {
        throw new Error('Something went wrong while removing the movie!');
      }

      // upon success, remove movie's id from localStorage
      removeMovieId(movieId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return null; // Return null while loading to avoid rendering content
  }

  return (
    <>
      <div fluid="true" className="text-light bg-black p-5">
        <Container>
          <h1>Your Saved Movies!🎞️🎬 </h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedMovies.length
            ? `Viewing your ${userData.savedMovies.length} saved ${userData?.savedMovies.length === 1 ? 'movie' : 'movies'}:`
            : 'You have no saved movies!'}
        </h2>
        <Row>
          {userData?.savedMovies.map((movie) => {
            return (
              <Col md="4" key={movie.movieId}>
                <Card border='dark'>
                  {movie.poster ? <Card.Img src={movie.poster} alt={`The cover for ${movie.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <p className='small'>Director: {movie.director}</p>
                    <Card.Text>{movie.plot}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteMovie(movie.movieId)}>
                      Delete this Movie!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedMovies;
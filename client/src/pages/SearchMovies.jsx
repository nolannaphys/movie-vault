import  { useState, useEffect } from "react";
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from "react-bootstrap";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { searchOMDB } from "../utils/API";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";
import { SAVE_MOVIE } from "../utils/mutations";
import { GET_ME } from "../utils/queries";

const SearchMovies = () => {
  // create state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  // set up useEffect hook to save `savedMovieIds` list to localStorage on component unmount

  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  });

  // create method to search for movies and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchOMDB(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const items = await response.json();
      console.log(items);
      // const bookData = items.map((book) => ({
      //   bookId: book.id,
      //   authors: book.volumeInfo.authors || ["No author to display"],
      //   title: book.volumeInfo.title,
      //   description: book.volumeInfo.description,
      //   image: book.volumeInfo.imageLinks?.thumbnail || "",
      //   link: book.volumeInfo.infoLink,
      // }));
    
    //NOTE - is this a better object?
      // const movieData = items.map((movie) => ({
      //   title: movie.movie,
      //   director: director.movie || ["No director to display"],
      //   plot: plot.movie.full,
      //   poster: poster.movie
      // }))

      //NOTE - Object Movie
      const movieData = [{
     
        title: items.Title,
        plot: items.Plot,
        poster: items.Poster,
        director: items.Director,
      }]


      //TODO - Find out what setSearchedMovies is doing
    main
      setSearchedMovies(movieData);
      setSearchInput("");
      console.log(movieData);
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a movie to our database
  const handleSaveMovie = async (movieId) => {
    // find the movie in `searchedMovies` state by the matching id
    const movieToSave = searchedMovies.find((movie) => movie.movieId === movieId);
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log("Is user logged in?", Auth.loggedIn());

    if (!token) {
      return false;
    }
    // console.log(movieToSave);
    try {
      await saveMovie({
        variables: {
          movieToSave: movieToSave // Pass the movieToSave object as the variable
        },
        //FIXME - why is it mad?
        update: (cache, { data }) => {
          console.log (cache, data)
          // Update cache here if needed
        },
        refetchQueries: [{ query: GET_ME }], // Refetch user data after saving the movie
      });

      console.log(movieToSave);
      if (error) {
        throw new Error("something went wrong!");
      }
      // if movie successfully saves to user's account, save movie id to state
      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
      console.log(savedMovieIds);
      window.location.assign('/saved');
    } catch (err) {
      console.error(err);
    }
  };

  //NOTE -  This is the return
  return (
    <>
      <div className="text-light bg-black pt-5">
        <Container style={{ backgroundColor: 'black' }}>
          <h1>Search for a Movie!🎥🎬 </h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a Movie to begin!"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg" style={{ backgroundColor: 'turquoise' }}>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5 test-class">
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} result:`
            : "Lights, Camera, Action!"}
        </h2>
        <Row className="movieWrap">
          {searchedMovies.map((movie) => {
            return (
              <Col key={movie.movieId} md="4">
                <Card className="movie-poster">
                  {movie.poster ? (
                    <Card.Img
                      src={movie.poster}
                      alt={`The cover for ${movie.title}`}
                      variant="top"
                      
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <p className="small">Director: {movie.director}</p>
                    <Card.Text>{movie.plot}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedMovieIds?.some(
                          (savedMovieId) => savedMovieId === movie.movieId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveMovie(movie.movieId)}
                      >
                        {savedMovieIds?.some(
                          (savedMovieId) => savedMovieId === movie.movieId
                        )
                          ? "This movie has already been saved!"
                          : "Save this Movie!"}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      <div>
        
      </div>
    </>
  );
};

export default SearchMovies;
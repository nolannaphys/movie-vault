import React, { useState, useEffect } from "react";
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
      const movieData = {
        title: items.Title,
        plot: items.Plot,
        poster: items.Poster,
      }
//TODO - Find out what setSearchedBooks is doing
      // setSearchedBooks(movieData);
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
          movieToSave: movieToSave // Pass the bookToSave object as the variable
        },
        update: (cache, { data }) => {
          // Update cache here if needed
        },
        refetchQueries: [{ query: GET_ME }], // Refetch user data after saving the book
      });

      console.log(bookToSave);
      if (error) {
        throw new Error("something went wrong!");
      }
      // if book successfully saves to user's account, save book id to state
      setSavedMovieIds([...savedMovieIds, bookToSave.bookId]);
      console.log(savedMovieIds);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark pt-5">
        <Container>
          <h1>Search for a Movie!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a movie"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a movie to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedMovieIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedMovieIds?.some(
                          (savedBookId) => savedBookId === book.bookId
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
    </>
  );
};

export default SearchBooks;
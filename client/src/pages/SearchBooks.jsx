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
import { searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import { SAVE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries";

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

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

      // setSearchedBooks(movieData);
      setSearchInput("");
      console.log(movieData);
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log("Is user logged in?", Auth.loggedIn());

    if (!token) {
      return false;
    }
    // console.log(bookToSave);
    try {
      await saveBook({
        variables: {
          bookToSave: bookToSave // Pass the bookToSave object as the variable
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
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      console.log(savedBookIds);
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
                        disabled={savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedBookIds?.some(
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
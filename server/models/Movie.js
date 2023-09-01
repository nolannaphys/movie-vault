const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedMovies` array in User.js
const movieSchema = new Schema({
  director: [
    {
      type: String,
    },
  ],
  plot: {
    type: String,
    required: true,
  },
  // saved movie id from OMDb
  poster: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = movieSchema;

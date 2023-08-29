// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`http://www.omdbapi.com/?t=${query}&apikey=9f162971`);
};

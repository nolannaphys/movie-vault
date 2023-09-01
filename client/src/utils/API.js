// make a search to Open Movie Database api

export const searchOMDB = (query) => {
  return fetch(`http://www.omdbapi.com/?t=${query}&apikey=9f162971`);
};

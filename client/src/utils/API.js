// make a search to Open Movie Database api

export const searchOMDB = (query) => {
  return fetch(`https://www.omdbapi.com/?t=${query}&apikey=9f162971`);
};

//NOTE - For future development
// calls multiple movies from OMDB
// export const searchOMDB = (query) => {
//   return fetch(`https://www.omdbapi.com/?s=${query}&apikey=9f162971`);
// };

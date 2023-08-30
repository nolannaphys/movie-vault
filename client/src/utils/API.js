// make a search to Open Movie Database api
//NOTE - searchGoogleBooks replaced by searchOMDB
export const searchOMDB = (query) => {
  return fetch(`http://www.omdbapi.com/?t=${query}&apikey=9f162971`);
};

const dotenv = require('dotenv');
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
		Authorization: `Bearer ${process.env.TMDB_ACCESS_KEY}`,
    accept: 'application/json',
  },
});

module.exports = api;
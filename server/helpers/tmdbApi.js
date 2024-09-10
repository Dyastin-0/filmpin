const dotenv = require('dotenv').config();
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${process.env.TMBD_ACCESS_KEY}`
  },
});

module.exports = api;
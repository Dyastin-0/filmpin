const api = require("../../helpers/tmdbApi");
const { movieGenres } = require("../../models/genreList");

/**
 * Fetches a paginated list of movies from a specific category.
 * @param {Object} req - The request object.
 * @param {string} req.query.category - One of the following: 'top_rated', 'upcoming', 'popular', 'now_playing'.
 * @param {number} req.query.page - Page number of the paginated response.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the list of movies.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetCategory = async (req, res) => {
  const { category, page } = req.query;

  if (!category) return res.status(400).json({ message: "Missing category." });
  if (!page) return res.status(400).json({ message: "Missing page number." });

  try {
    const response = await api.get(
      `movie/${category}?language=en-US&page=${page}&sort_by=popularity.desc`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch list.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches detailed information for a specific movie.
 * @param {Object} req - The request object.
 * @param {number} req.query.movie_id - The ID of the movie to fetch details for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing movie details.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetDetails = async (req, res) => {
  const { movie_id } = req.query;

  if (!movie_id) return res.status(400).json({ message: "Missing movie ID" });

  try {
    const response = await api.get(`movie/${movie_id}?language=en-US`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch details", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches credits (cast and crew) for a specific movie.
 * @param {Object} req - The request object.
 * @param {number} req.query.movie_id - The ID of the movie to fetch credits for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the movie credits.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetCredits = async (req, res) => {
  const { movie_id } = req.query;

  if (!movie_id) return res.status(400).json({ message: "Missing movie ID." });

  try {
    const response = await api.get(
      `movie/${movie_id}/credits?sort_by=popularity&language=en-US`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch credits.", error);
    res.sendStatus(500);
  }
};

/**
 * Searches for movies based on a query string.
 * @param {Object} req - The request object.
 * @param {string} req.query.query - The search term for movie titles.
 * @param {number} req.query.page - Page number of the paginated response.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing search results.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleSearch = async (req, res) => {
  const { query, page } = req.query;

  if (!query) return res.status(400).json({ message: "Missing query." });
  if (!page) return res.status(400).json({ message: "Missing page number." });

  try {
    const response = await api.get(
      `search/movie?query=${query}&include_adult=false&video=false&language=en-US&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to search.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches videos (trailers, teasers, etc.) for a specific movie.
 * @param {Object} req - The request object.
 * @param {number} req.query.movie_id - The ID of the movie to fetch videos for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the movie's videos.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetVideo = async (req, res) => {
  const { movie_id } = req.query;

  if (!movie_id) return res.status(400).json({ message: "Missing movie ID." });

  try {
    const response = await api.get(`movie/${movie_id}/videos?language=en-US`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch videos.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches a list of movies based on genres.
 * @param {Object} req - The request object.
 * @param {string} req.query.genres - A list of genres separated by underscores (_), e.g., 'action_drama'.
 * @param {string} req.query.sort_by - The sorting parameter, see available options at https://developer.themoviedb.org/reference/discover-movie.
 * @param {number} req.query.page - Page number of the paginated response.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing a list of movies that match the genre(s).
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleDiscover = async (req, res) => {
  const { genres, sort_by, page } = req.query;

  if (!sort_by) return res.status(400).json({ message: "Missing sort key." });
  if (!page) return res.status(400).json({ message: "Missing page number." });

  const genresArray = genres.split("_");
  const genreKeys = genresArray.map((genre) => movieGenres[genre]);
  const joinedKeys = genreKeys.join(",");

  try {
    const response = await api.get(
      `discover/movie?include_adult=false&language=en-US&with_genres=${joinedKeys}&sort_by=${sort_by}.desc&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to get discover.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches watch providers for a specific movie.
 * @param {Object} req - The request object.
 * @param {number} req.query.movie_id - The ID of the movie to fetch watch providers for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the movie's watch providers.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetWatchProvider = async (req, res) => {
  const { movie_id } = req.query;

  if (!movie_id) return res.status(400).json({ message: "Missing movie ID" });

  try {
    const response = await api.get(`movie/${movie_id}/watch/providers`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to get watch providers for movie.", error);
    res.status(500);
  }
};

module.exports = {
  handleGetCategory,
  handleGetDetails,
  handleGetCredits,
  handleSearch,
  handleGetVideo,
  handleDiscover,
  handleGetWatchProvider,
};

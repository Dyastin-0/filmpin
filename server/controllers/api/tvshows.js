const api = require("../../helpers/tmdbApi");
const { tvGenres } = require("../../models/genreList");

/**
 * Fetches a paginated list of TV shows from a specific category.
 * @param {Object} req - The request object.
 * @param {string} req.query.category - One of the following: 'top_rated', 'popular', 'airing_today', 'on_the_air'.
 * @param {number} req.query.page - Page number of the paginated response.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the list of TV shows.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetCategory = async (req, res) => {
  const { category, page } = req.query;
  try {
    const response = await api.get(
      `tv/${category}?language=en-US&page=${page}&sort_by=vote_count.desc`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch TV list.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches detailed information for a specific TV show.
 * @param {Object} req - The request object.
 * @param {number} req.query.show_id - The ID of the TV show to fetch details for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing TV show details.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetDetails = async (req, res) => {
  const { show_id } = req.params;
  try {
    const response = await api.get(`tv/${show_id}?language=en-US`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch TV details", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches credits (cast and crew) for a specific TV show.
 * @param {Object} req - The request object.
 * @param {number} req.query.show_id - The ID of the TV show to fetch credits for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the TV show credits.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetCredits = async (req, res) => {
  const { show_id } = req.params;
  try {
    const response = await api.get(`tv/${show_id}/credits?language=en-US`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch credits.", error);
    res.sendStatus(500);
  }
};

/**
 * Searches for TV shows based on a query string.
 * @param {Object} req - The request object.
 * @param {string} req.query.query - The search term for TV shows.
 * @param {number} req.query.page - Page number of the paginated response.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing search results.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleSearch = async (req, res) => {
  const { query, page } = req.query;
  try {
    const response = await api.get(
      `search/tv?query=${query}&include_adult=false&video=false&language=en-US&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to search.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches videos (trailers, teasers, etc.) for a specific TV show.
 * @param {Object} req - The request object.
 * @param {number} req.query.show_id - The ID of the TV show to fetch videos for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing the TV show's videos.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetVideo = async (req, res) => {
  const { show_id } = req.params;
  try {
    const response = await api.get(`tv/${show_id}/videos?language=en-US`);
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch videos.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches a list of TV shows based on genres.
 * @param {Object} req - The request object.
 * @param {string} req.query.genres - A list of genres separated by underscores (_), e.g., 'action_drama'.
 * @param {string} req.query.sort_by - The sorting parameter, see available options at https://developer.themoviedb.org/reference/discover-tv.
 * @param {number} req.query.page - Page number of the paginated response.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing a list of TV shows that match the genre(s).
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleDiscover = async (req, res) => {
  const { genres, sort_by, page } = req.query;
  const genresArray = genres?.split("_");
  const genreKeys = genresArray?.map((genre) => tvGenres[genre]);
  const joinedKeys = genreKeys?.join(",");
  try {
    const response = await api.get(
      `discover/tv?include_adult=false&language=en-US&with_genres=${joinedKeys}&sort_by=${sort_by}.desc&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to get discover.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches details for a specific season of a TV show.
 * @param {Object} req - The request object.
 * @param {number} req.query.show_id - The ID of the TV show.
 * @param {number} req.query.season_number - The season number to fetch.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing season details.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetSeason = async (req, res) => {
  const { show_id, season_number } = req.params;

  try {
    const response = await api.get(
      `tv/${show_id}/season/${season_number}?language=en-US`
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Failed fetching TV season.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches details for a specific episode of a TV show season.
 * @param {Object} req - The request object.
 * @param {number} req.query.show_id - The ID of the TV show.
 * @param {number} req.query.season_number - The season number.
 * @param {number} req.query.episode_number - The episode number to fetch.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing episode details.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetEpisode = async (req, res) => {
  const { show_id, season_number, episode_number } = req.params;

  try {
    const response = await api.get(
      `tv/${show_id}/season/${season_number}/episode/${episode_number}?language=en-US`
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch TV episode.");
    res.sendStatus(500);
  }
};

/**
 * Fetches videos for a specific season of a TV show.
 * @param {Object} req - The request object.
 * @param {number} req.query.show_id - The ID of the TV show.
 * @param {number} req.query.tvshow_season - The season number to fetch videos for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing season videos.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetSeasonVideo = async (req, res) => {
  const { show_id, season_number } = req.params;

  try {
    const response = await api.get(
      `tv/${show_id}/season/${season_number}/videos?language=en-US`
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Failed to get TV show season videos.", error);
    res.sendStatus(500);
  }
};

/**
 * Fetches videos for a specific episode of a TV show season.
 * @param {Object} req - The request object.
 * @param {number} req.query.show_id - The ID of the TV show.
 * @param {number} req.query.show_season - The season number.
 * @param {number} req.query.episode_number - The episode number to fetch videos for.
 * @param {Object} res - The response object.
 * @returns {Object} JSON object containing episode videos.
 * @throws {Error} If the request fails, returns a 500 status.
 */
const handleGetEpisodeVideo = async (req, res) => {
  const { show_id, show_season, episode_number } = req.params;

  try {
    const response = await api.get(
      `tv/${show_id}/season/${show_season}/episode/${episode_number}/videos?language=en-US`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to get TV show episode videos.", error);
    res.sendStatus(500);
  }
};

module.exports = {
  handleGetCategory,
  handleGetDetails,
  handleGetCredits,
  handleDiscover,
  handleSearch,
  handleGetVideo,
  handleGetSeason,
  handleGetEpisode,
  handleGetSeasonVideo,
  handleGetEpisodeVideo,
};

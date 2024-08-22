const api = require('../../helpers/tmdbApi');
const { movieGenres } = require('../../models/genreList');

const handleGetCategory = async (req, res) => {
	const { category, page } = req.query;

	try {
		const response = await api.get(`movie/${category}?language=en-US&${page}&sort_by=popularity.desc`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch list.', error);
		res.sendStatus(500);
	}
}

const handleGetDetails = async (req, res) => {
	const { movie_id } = req.query;
	try {
		const response = await api.get(`movie/${movie_id}?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch details', error);
		res.sendStatus(500);
	}
}

const handleGetCredits = async (req, res) => {
	const { movie_id } = req.query;
	try {
		const response = await api.get(`movie/${movie_id}/credits?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch credits.', error);
		res.sendStatus(500);
	}
}

const handleSearch = async (req, res) => {
	const { query, page } = req.query;
	try {
		const response = await api.get(`search/movie?query=${query}&include_adult=false&video=false&language=en-US&page=${page}`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to search.', error);
		res.sendStatus(500);
	}
}

const handleGetVideo = async (req, res) => {
	const { movie_id } = req.query;
	try {
		const response = await api.get(`movie/${movie_id}/videos?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to search.', error);
		res.sendStatus(500);
	}
}

const handleDiscover = async (req, res) => {
	const { genres, sort_by, page } = req.query;

	const genresArray = genres.split('_');
	const genreKeys = genresArray.map(genre => movieGenres[genre]);
	const joinedKeys = genreKeys.join(',');

	try {
		const response = await api.get(`/discover/movie?include_adult=false&language=en-US&with_genres=${joinedKeys}&sort_by=${sort_by}.desc&page=${page}`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to get discover.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleGetCategory,
	handleGetDetails,
	handleGetCredits,
	handleSearch,
	handleGetVideo,
	handleDiscover
};
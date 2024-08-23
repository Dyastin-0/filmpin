const api = require('../../helpers/tmdbApi');
const { tvGenres } = require('../../models/genreList');

const handleGetCategory = async (req, res) => {
	const { category, page } = req.query;
	try {
		const response = await api.get(`tv/${category}?language=en-US&${page}&sort_by=vote_count.desc`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch tv list.', error);
		res.sendStatus(500);
	}
}

const handleGetDetails = async (req, res) => {
	const { show_id } = req.query;
	try {
		const response = await api.get(`tv/${show_id}?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch tv details', error);
		res.sendStatus(500);
	}
}

const handleGetCredits = async (req, res) => {
	const { show_id } = req.query;
	try {
		const response = await api.get(`tv/${show_id}/credits?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch credits.', error);
		res.sendStatus(500);
	}
}

const handleSearch = async (req, res) => {
	const { query, page } = req.query;
	try {
		const response = await api.get(`search/tv?query=${query}&include_adult=false&video=false&language=en-US&${page}`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to search.', error);
		res.sendStatus(500);
	}
}

const handleGetVideo = async (req, res) => {
	const { show_id } = req.query;
	try {
		const response = await api.get(`tv/${show_id}/videos?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to search.', error);
		res.sendStatus(500);
	}
}

const handleDiscover = async (req, res) => {
	const { genres, sort_by, page } = req.query;
	const genresArray = genres?.split('_');
	const genreKeys = genresArray?.map(genre => tvGenres[genre]);
	const joinedKeys = genreKeys?.join(',');
	try {
		const response = await api.get(`discover/tv?include_adult=false&language=en-US$&with_genres=${joinedKeys}&sort_by=${sort_by}.desc&page=${page}`);
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
	handleDiscover,
	handleSearch,
	handleGetVideo
}
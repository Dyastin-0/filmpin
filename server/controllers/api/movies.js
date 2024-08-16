const api = require('../../helpers/tmdbApi');

const handleGetCategory = async (req, res) => {
	const { category, page } = req.params;
	try {
		const response = await api.get(`movie/${category}?language=en-US&${page}`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch list.', error);
		res.sendStatus(500);
	}
}

const handleGetDetails = async (req, res) => {
	const { movie_id } = req.params;
	try {
		const response = await api.get(`movie/${movie_id}?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch details', error);
		res.sendStatus(500);
	}
}

const handleGetCredits = async (req, res) => {
	const { movie_id } = req.params;
	try {
		const response = await api.get(`movie/${movie_id}/credits?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch credits.', error);
		res.sendStatus(500);
	}
}

const handleSearch = async (req, res) => {
	const { query } = req.params;
	try {
		const response = await api.get(`search/movie?query=${query}&include_adult=true&language=en-US&page=1`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to search.', error);
		res.sendStatus(500);
	}
}

const handleGetVideo = async (req, res) => {
	const { movie_id } = req.params;
	try {
		const response = await api.get(`movie/${movie_id}/videos?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to search.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleGetCategory,
	handleGetDetails,
	handleGetCredits,
	handleSearch,
	handleGetVideo
};
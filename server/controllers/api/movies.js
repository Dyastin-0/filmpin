const api = require('../../helpers/tmdbApi');

const handleGetCategory = async (req, res) => {
	const { category, page } = req.params;
	try {
		const response = await api.get(`movie/${category}?language=en-US&${page}`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch list.', error);
		res.sendStatus(404);
	}
}

const handleGetDetails = async (req, res) => {
	const { movie_id } = req.params;
	try {
		const response = await api.get(`movie/${movie_id}?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch details', error);
		res.sendStatus(404);
	}
}

const handleGetCredits = async (req, res) => {
	const { movie_id } = req.params;
	try {
		const response = await api.get(`movie/${movie_id}/credits?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error('Failed to fetch credits.', error);
		res.sendStatus(404);
	}
}

module.exports = {
	handleGetCategory,
	handleGetDetails,
	handleGetCredits
};
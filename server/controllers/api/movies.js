const api = require('../../helpers/tmdbApi');

const handleGetCategory = async (req, res) => {
	const { category, page } = req.params;
	try {
		const response = await api.get(`movie/${category}?language=en-US&${page}`);
		res.json(response.data);
	} catch (error) {
		console.error(error);
	}
}

const handleGetDetails = async (req, res) => {
	const { movie_id } = req.params;
	try {
		const response = await api.get(`movie/${movie_id}?language=en-US`);
		res.json(response.data);
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	handleGetCategory,
	handleGetDetails
};
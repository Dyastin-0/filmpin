const api = require("../../helpers/tmdbApi");

const handleGetPublicBackdrops = async (req, res) => {
	const { category, list, page } = req.query;

	try {
		const response = await api.get(`${category}/${list}?page=${page}&language=en-US`);
		res.json(response.data.results.map(result => result.backdrop_path));
	} catch (error) {
		console.log('Failed to fetch backdrops.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleGetPublicBackdrops
}
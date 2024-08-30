const api = require("../../helpers/tmdbApi");

const handleGetPublicBackdrops = async (req, res) => {
	const { category, list, page } = req.query;

	try {
		const response = await api.get(`${category}/${list}?page=${page}&language=en-US`);
		res.json(response.data.results.map(result => {
			return {
				backdrop_path: result.backdrop_path,
				poster_path: result.poster_path,
				id: result.id,
				title: result.title
			}
		}));
	} catch (error) {
		console.log('Failed to fetch backdrops.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleGetPublicBackdrops
}
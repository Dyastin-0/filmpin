const Users = require('../../models/user');
const api = require('../../helpers/tmdbApi');

const handleGetMovies = async (req, res) => {
	try {
		const response = await api.get('movie/top_rated?language=en-US&page=1');
		res.json(response.data);
	} catch (error) {
		console.error(error);
	}
}

module.exports = handleGetMovies;
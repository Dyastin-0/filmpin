const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if (origin.indexOf(allowedOrigins)) {
		res.header('Access-Control-Allow-Credentials', true);
	}
	next();
}

module.exports = credentials;
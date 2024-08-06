const allowedOrigins = [
	'http://localhost:3000',
	'http://localhost:5173'
];

const corsOptions = {
	origin: (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by cors.'));
		}
	},
	optionSuccessStatus: 200
}

module.exports = corsOptions;
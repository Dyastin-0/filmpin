const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const axios = require('axios');
const { mongoose } = require('mongoose');
const credentials = require('./middlewares/credentials');
const corsOptions = require('./config/corsOption');
const { verifyJsonWebToken } = require('./middlewares/verifyJsonWebToken');



//database connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("Connected."))
.catch((err) => console.log(err))

const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', require('./routes/auth'));
app.use('/sign-up', require('./routes/auth'));
app.use('/sign-in', require('./routes/auth'));
app.use('/refreshAccessToken', require('./routes/auth'));
app.use('/log-out', require('./routes/auth'));

app.use(verifyJsonWebToken);
app.use('/movies', require('./routes/api/movies'));

if (!process.env.SERVER_URL) {
	cron.schedule('*/14 * * * *', async () => {
		try {
			await axios.get(`${process.env.SERVER_URL}`);
			console.log('Pinged the server.');
		} catch (error) {
			console.error('Error pinging the server:', error);
		}
	});
	console.log('Cron job running.');
} else {
	console.log('Cron job is not running.');
}

const port = 3000;
app.listen(port, () => {
	console.log(`Express is running on port:${port}.`);
});
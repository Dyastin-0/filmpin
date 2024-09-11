const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { mongoose } = require('mongoose');
const credentials = require('./middlewares/credentials');
const corsOptions = require('./config/corsOption');
const { verifyJsonWebToken } = require('./middlewares/verifyJsonWebToken');
const { startListStream } = require('./helpers/changeStream');
const allowedOrigins = require('./config/allowedOrigins');
const verifySocketJsonWebToken = require('./middlewares/verifySocketJsonWebToken');

mongoose.connect(process.env.MONGODB_URL)
	.then(() => console.log("Connected."))
	.catch((err) => console.log(err))

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: allowedOrigins,
		methods: ["GET", "POST"],
		credentials: true
	},
});

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/', require('./routes/auth'));
app.use('/api/sign-up', require('./routes/auth'));
app.use('/api/sign-in', require('./routes/auth'));
app.use('/api/refreshAccessToken', require('./routes/auth'));
app.use('/api/log-out', require('./routes/auth'));
app.use('/api/email', require('./routes/email'));
app.use('/api/recover', require('./routes/email'));

app.use('/api/public/account', require('./routes/public/account'));
app.use('/api/public/backdrops', require('./routes/public/backdrops'));

app.use(verifyJsonWebToken);
app.use('/api/account', require('./routes/api/account/account'));
app.use('/api/list', require('./routes/api/account/list'));
app.use('/api/movies', require('./routes/api/movies'));
app.use('/api/tvshows', require('./routes/api/tvshows'));

io.use(verifySocketJsonWebToken);
io.on('connection', (socket) => {
	const { owner, randomId, targetStream } = socket.handshake.query;

	if (targetStream === 'list') {
		startListStream(socket, mongoose, owner, randomId);
	}

});

const port = 3000;
server.listen(port, () => {
	console.log(`Express is running on port:${port}.`);
});
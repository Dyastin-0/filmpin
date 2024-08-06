const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { mongoose } = require('mongoose');

//database connection
mongoose.connect(process.env.DB_URL)
.then(() => console.log("Connected."))
.catch((err) => console.log(err))

const app = express();

app.use(express.json());
app.use('/', require('./routes/auth'));
app.use('/signup', require('./routes/auth'));
app.use('/signin', require('./routes/auth'));

const port = 3000;
app.listen(port, () => {
	console.log(`Express is running on port:${port}.`);
});
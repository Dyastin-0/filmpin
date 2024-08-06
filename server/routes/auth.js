const express = require('express');
const router = express.Router();
const cors = require('cors');

const { Signup, test } = require('../controllers/auth');

//middleware
router.use(cors({
	credentials: true,
	origin: 'http://localhost:5173'
}));

router.get('/test', test);
router.post('/signup', Signup);

module.exports = router;
const express = require('express');
const router = express.Router();
const cors = require('cors');

const { test, 
	handleSignin, 
	handleSignup, 
	handleRefreshAccessToken,
	handleSignout
 } = require('../controllers/auth');
const { verifyJsonWebToken } = require('../middlewares/verifyJsonWebToken');
const verifyRoles = require('../middlewares/verifyRoles');

//middleware
router.use(cors({
	credentials: true,
	origin: 'http://localhost:5173'
}));

router.get('/', test);
router.get('/admin', verifyRoles, test);
router.get('/refreshAccessToken', handleRefreshAccessToken);
router.post('/sign-out', handleSignout);
router.post('/sign-up', handleSignup);
router.post('/sign-in', handleSignin);

module.exports = router;
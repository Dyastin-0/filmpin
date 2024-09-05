const Users = require('../../models/user');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sendHtmlEmail } = require('../../helpers/email');
const { emailTemplate } = require('../../templates/email');
const { hash } = require('../../helpers/hash');

/**
 * Sends a verification email to the user if they have not already been verified.
 * @param {Object} req - The request object.
 * @param {string} req.query.email - The user's email.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON status message.
 * @throws {Error} - Returns status 500 if an internal error occurs.
 */
const handleSendVerification = async (req, res) => {
	const { email } = req.query;

	if (!email) return res.status(400).json({ message: 'Missing email.' });

	try {
		const user = await Users.findOne({ email: email });
		if (!user) return res.status(403).json({ message: 'Account not found.' });
		if (user.verified) return res.status(400).json({ message: 'Account is already verified.' });

		let hasActiveToken = false;
		if (user.verificationToken) {
			jwt.verify(
				user.verificationToken,
				process.env.EMAIL_TOKEN_SECRET,
				(error, _) => {
					if (error) return;
					hasActiveToken = true;
				}
			);
		}

		if (hasActiveToken)
			return res.status(400).json({ message: 'You have an active verification token, check your email for the link.' });

		const verificationToken = jwt.sign(
			{ email: email },
			process.env.EMAIL_TOKEN_SECRET,
			{ expiresIn: '5m' }
		);

		await Users.updateOne({ email: email }, { $set: { verificationToken: verificationToken } });

		sendHtmlEmail(
			email,
			'Verification',
			emailTemplate(
				'Verify your account',
				'To proceed with accessing our app, please click the link below. You may disregard this email if you did not request it.',
				`${process.env.BASE_CLIENT_URL}/account/verification?verificationToken=${verificationToken}`,
				'Verify your account'
			)
		);

		res.sendStatus(200);
	} catch (error) {
		console.error('Failed to send account verification.', error);
		res.sendStatus(500);
	}
}

/**
 * Verifies the user's email using the provided token.
 * @param {Object} req - The request object.
 * @param {string} req.query.verificationToken - The verification token.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON message indicating success or failure.
 * @throws {Error} - Returns status 500 if an internal error occurs.
 */
const handleVerifyEmail = async (req, res) => {
	const { verificationToken } = req.query;

	if (!verificationToken) return res.status(400).json({ message: 'Missing verification token.' });

	try {
		jwt.verify(
			verificationToken,
			process.env.EMAIL_TOKEN_SECRET,
			async (error, decoded) => {
				if (error)
					return res.status(404).json({ message: 'Verification token is expired.' });

				const user = await Users.findOne({ email: decoded.email, verificationToken: verificationToken });

				if (!user)
					return res.status(404).json({ message: 'Account not found.' });

				if (user.verified)
					return res.status(400).json({ message: 'Your account is already verified.' });

				await Users.updateOne({ email: decoded.email }, { $set: { verificationToken: null, verified: true } });
				res.status(200).json({ message: 'Your account has been successfully verified!' });
			}
		);

	} catch (error) {
		console.error('Failed to verify email.', error);
		res.sendStatus(500);
	}
}

/**
 * Recovers the user's account by updating the password with a valid recovery token.
 * @param {Object} req - The request object.
 * @param {string} req.query.recoveryToken - The recovery token.
 * @param {string} req.body.password - The new password for the account.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON message indicating success or failure.
 * @throws {Error} - Returns status 500 if an internal error occurs.
 */
const handleRecoverAccount = async (req, res) => {
	const { recoveryToken } = req.query;
	const { password } = req.body;

	if (!recoveryToken) return res.status(400).json({ message: 'Missing recovery token.' });
	if (!password) return res.status(400).json({ message: 'Missing password.' });

	try {
		jwt.verify(
			recoveryToken,
			process.env.EMAIL_TOKEN_SECRET,
			async (error, decoded) => {
				if (error)
					return res.status(404).json({ message: 'Recovery token is expired.' });

				const user = await Users.findOne({ email: decoded.email, recoveryToken: recoveryToken });

				if (!user)
					return res.status(404).json({ message: 'Account not found.' });

				const hashedPassword = await hash(password);

				await Users.updateOne({ email: decoded.email }, { $set: { recoveryToken: null, password: hashedPassword } });
				res.status(200).json({ message: 'Your account has been successfully recovered!' });
			}
		);
	} catch (error) {
		console.error('Failed to recover account.', error);
		res.sendStatus(500);
	}
}

/**
 * Sends a recovery email to the user if they have a verified account.
 * @param {Object} req - The request object.
 * @param {string} req.query.email - The user's email.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON status message.
 * @throws {Error} - Returns status 500 if an internal error occurs.
 */
const handleSendRecovery = async (req, res) => {
	const { email } = req.query;

	if (!email) return res.status(400).json({ message: 'Missing email.' });

	try {
		const user = await Users.findOne({ email: email });

		if (!user) return res.status(404).json({ message: 'Account not found.' });

		if (!user.verified) return res.status(400).json({ message: 'Your account is not verified.' });

		let hasActiveToken = false;
		if (user.recoveryToken) {
			jwt.verify(
				user.recoveryToken,
				process.env.EMAIL_TOKEN_SECRET,
				(error, _) => {
					if (error) return;
					hasActiveToken = true;
				}
			);
		}

		if (hasActiveToken)
			return res.status(400).json({ message: 'You have an active recovery token, check your email for the link.' });

		const recoveryToken = jwt.sign(
			{ email: email },
			process.env.EMAIL_TOKEN_SECRET,
			{ expiresIn: '5m' }
		);

		await Users.updateOne({ email: email }, { $set: { recoveryToken: recoveryToken } });

		sendHtmlEmail(
			email,
			'Recovery',
			emailTemplate(
				'Recover your account',
				'To recover your account, click the link below. You may disregard this email if you did not request it.',
				`${process.env.BASE_CLIENT_URL}/account/recovery?recoveryToken=${recoveryToken}`,
				'Recover your account'
			)
		);

		res.status(200).json({ message: 'Recovery link sent.' });
	} catch (error) {
		console.error('Failed to send account recovery link.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleVerifyEmail,
	handleSendVerification,
	handleRecoverAccount,
	handleSendRecovery
}

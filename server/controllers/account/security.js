const Users = require('../../models/user');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { sendTextEmail } = require('../../helpers/email');
const { messageTemplate } = require('../../templates/email/auth');

const handleSendVerification = async (req, res) => {
	const { email } = req.query;

	try {
		const user = await Users.findOne({ email: email });
		if (!user) return res.status(403).json({ message: 'Account not found.' });
		if (user.verified) return res.status(200).json({ message: 'Account is already verified.' });

		const verificationToken = jwt.sign(
			{ email: email },
			process.env.EMAIL_TOKEN_SECRET,
			{ expiresIn: '5m' }
		);

		sendTextEmail(
			email,
			'Verify your Filmpin account.',
			`filmpin-api.onrender.com/verify?verificationToken=${verificationToken}`,
		);

		res.sendStatus(200);
	} catch (error) {
		console.error('Failed to send account verification.', error);
	}
}

const handleVerifyEmail = async (req, res) => {
	const { verificationToken } = req.query;
	if (!verificationToken) return res.status(400).send(messageTemplate('Verification', 'Missing verification token.'));

	try {
		const user = Users.findOne({ verificationToken: verificationToken });
		if (!user)
			return res.status(404).send(
				messageTemplate(
					'Verification',
					'Account not found.'
				)
			);

		jwt.verify(
			verificationToken,
			process.env.EMAIL_TOKEN_SECRET,
			async (error, decoded) => {
				if (error)
					return res.status(404).send(
						messageTemplate(
							'Verification',
							'Token expired.',
							'filmpin.onrender.com/account/verify',
							'Send another verification link'
						)
					);
				await Users.updateOne({ email: decoded.email }, { $set: { verificationToken: null, verified: true } });
				res.status(200).send(
					messageTemplate(
						'Filmpin',
						'Your account has been successfully verified!'
					)
				);
			}
		);

	} catch (error) {
		console.error('Failed to verify email.', error);
		res.sendStatus(500);
	}
}

module.exports = {
	handleVerifyEmail,
	handleSendVerification
}

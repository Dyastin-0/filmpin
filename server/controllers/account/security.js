const Users = require('../../models/user');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { sendHtmlEmail } = require('../../helpers/email');
const { messageTemplate } = require('../../templates/auth');
const { emailTemplate } = require('../../templates/email');

const handleSendVerification = async (req, res) => {
	const { email } = req.query;

	try {
		const user = await Users.findOne({ email: email });
		if (!user) return res.status(403).json({ message: 'Account not found.' });
		if (user.verified) return res.status(400).json({ message: 'Account is already verified.' });

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
				'To proceed with accessing our app, please click the link below. You may disregard this email if you did not request for it.',
				`filmpin-api.onrender.com/verify?verificationToken=${verificationToken}`,
				'Verify your account'
			)
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

				const user = await Users.findOne({ email: decoded.email,  verificationToken: verificationToken });

				if (!user)
					return res.status(404).send(
						messageTemplate(
							'Verification',
							'Account not found.'
						)
					);
		
				if (user.verified)
					return res.status(200).send(
						messageTemplate(
							'Verification',
							'Your account is already verified.'
						)
					);

				await Users.updateOne({ email: decoded.email }, { $set: { verificationToken: null, verified: true } });
				res.status(200).send(
					messageTemplate(
						'Verification',
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

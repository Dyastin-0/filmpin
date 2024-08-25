const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.SERVER_EMAIL,
		pass: process.env.SERVER_EMAIL_PASSWORD
	}
});

const sendTextEmail = async (to, subject, text) => {
	try {
		transporter.sendMail({
			from: process.env.SERVER_EMAIL,
			to: to,
			subject: subject,
			text: text
		});
	} catch (error) {
		console.error('Failed to send text email', error);
	}
}

const sendHtmlEmail = async (to, subject, html) => {
	try {
		transporter.sendMail({
			from: process.env.SERVER_EMAIL,
			to: to,
			subject: subject,
			html: html
		});
	} catch (error) {
		console.error('Failed to send html email.', error);
	}
}

module.exports = {
	sendTextEmail,
	sendHtmlEmail
}
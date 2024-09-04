const dotenv = require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(imageBuffer, publicId) {
	try {
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload_stream(
				{ public_id: publicId },
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				}
			).end(imageBuffer);
		});

		return result;
	} catch (error) {
		throw new Error(`Image upload failed: ${error.message}`);
	}
}

module.exports = { uploadImage };
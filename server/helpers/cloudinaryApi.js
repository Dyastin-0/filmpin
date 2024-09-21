const dotenv = require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary using a buffer.
 *
 * @param {Buffer} imageBuffer - The image file as a buffer.
 * @param {string} publicId - A unique identifier for the uploaded image on Cloudinary.
 *
 * @returns {Promise<Object>} A promise that resolves with the upload result from Cloudinary.
 * @throws {Error} Throws an error if the image upload fails.
 */
async function uploadImage(imageBuffer, publicId) {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ public_id: publicId }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(imageBuffer);
    });

    return result;
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

module.exports = { uploadImage };

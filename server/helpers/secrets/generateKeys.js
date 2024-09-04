const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const getSecret = require('./getSecret');

const envFilePath = path.join(__dirname, '../../.env');

const generateKeys = async () => {
  try {
    const accessKey = crypto.randomBytes(64).toString('hex');
    const refreshKey = crypto.randomBytes(64).toString('hex');
    const emailKey = crypto.randomBytes(64).toString('hex');

    const dbUrl = await getSecret('MDB_ACCESS_URI');
    const tmDbKey = await getSecret('TMDB_ACCESS_KEY');
    const serverEmail = await getSecret('SERVER_EMAIL');
    const serverEmailPassword = await getSecret('SERVER_EMAIL_PASSWORD');
    const cloudinaryCloudName = await getSecret('CLOUDINARY_CLOUD_NAME');
    const cloudinaryApiKey = await getSecret('CLOUDINARY_API_KEY');
    const cloudinaryApiSecret = await getSecret('CLOUDINARY_API_SECRET');

    const newVariables = [
      `MONGODB_URL=${dbUrl}`,
      `TMBD_ACCESS_KEY=${tmDbKey}`,
      `SERVER_EMAIL=${serverEmail}`,
      `SERVER_EMAIL_PASSWORD=${serverEmailPassword}`,
      `ACCESS_TOKEN_SECRET=${accessKey}`,
      `REFRESH_TOKEN_SECRET=${refreshKey}`,
      `EMAIL_TOKEN_SECRET=${emailKey}`,
      `CLOUDINARY_CLOUD_NAME=${cloudinaryCloudName}`,
      `CLOUDINARY_API_KEY=${cloudinaryApiKey}`,
      `CLOUDINARY_API_SECRET=${cloudinaryApiSecret}`
    ];

    const fileContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });

    const lines = fileContent.split('\n');

    const firstLine = lines[0];
    const newContent = [firstLine, ...newVariables].join('\n') + '\n';

    fs.writeFileSync(envFilePath, newContent, { encoding: 'utf8' });

    console.log(`Successfully updated secrets in ${envFilePath}.`);
  } catch (error) {
    console.error('Error generating keys or updating .env file:', error);
  }
};

generateKeys();
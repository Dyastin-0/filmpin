const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const getSecret = require('../helpers/getSecret');

const envFilePath = path.join(__dirname, '../.env');

const generateKeys = async () => {
  try {
    const accessKey = crypto.randomBytes(64).toString('hex');
    const refreshKey = crypto.randomBytes(64).toString('hex');

    let envContent = '';
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });
    }

    const dbUrl = await getSecret('MDB_ACCESS_URI');
    const tmDbKey = await getSecret('TMDB_ACCESS_KEY');

    const envMap = envContent.split('\n').reduce((map, line) => {
      const [key, value] = line.split('=');
      if (key) map[key.trim()] = value ? value.trim() : '';
      return map;
    }, {});

    const newVariables = {
      MONGODB_URL: dbUrl,
      TMBD_ACCESS_KEY: tmDbKey,
      ACCESS_TOKEN_SECRET: accessKey,
      REFRESH_TOKEN_SECRET: refreshKey
    };

    Object.keys(newVariables).forEach(key => {
      envMap[key] = newVariables[key];
    });

    const updatedEnvContent = Object.entries(envMap)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n';

    fs.writeFileSync(envFilePath, updatedEnvContent, { encoding: 'utf8' });

    console.log(`Successfully updated ${envFilePath} with new secrets.`);
  } catch (error) {
    console.error('Error generating keys or updating .env file:', error);
  }
}

generateKeys();

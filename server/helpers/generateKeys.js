const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envFilePath = path.join(__dirname, '../.env');

const accessKey = crypto.randomBytes(64).toString('hex');
const refreshKey = crypto.randomBytes(64).toString('hex');

const dbUrlLine = 'MONGODB_URL=mongodb+srv://filmpinadmin:afd221b33A!%40%40!@filmpin.o7sdrgz.mongodb.net/?retryWrites=true&w=majority&appName=filmpin\n';
const accessKeyLine = `ACCESS_TOKEN_SECRET=${accessKey}\n`;
const refreshKeyLine = `REFRESH_TOKEN_SECRET=${refreshKey}\n`;
const tmDbKeyLine = 'TMDB_ACCESS_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzg4OWI5ODRmODFlY2UzZjdjYjY4NjEzNGFiMjg2NSIsIm5iZiI6MTcyMzA4NTU1NC4xMDY1MjYsInN1YiI6IjYzZmIzOWJiOTZlMzBiMDA4MzI2NzFhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z6RbAUM5IH8CrX_1sKYyCKq0dJHjeML_VCt7BAIrscU';

const envContent = `${dbUrlLine}${accessKeyLine}${refreshKeyLine}${tmDbKeyLine}`;

fs.writeFileSync(envFilePath, envContent, { encoding: 'utf8' });

console.log(`Successfully created ${envFilePath} with secrets.`);

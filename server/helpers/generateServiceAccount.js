const fs = require('fs');
const path = require('path');
const dontenv = require('dotenv').config();

const tempFilePath = path.join(__dirname, '../secretsaccesor.json');

fs.writeFileSync(tempFilePath, process.env.SECRETS_SERVICE_ACCOUT.toString());
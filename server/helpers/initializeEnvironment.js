const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../.env');

const initializeEnvironment = () => {
  const initialVariable = 'GOOGLE_APPLICATION_CREDENTIALS=./secretsaccesor.json\n';
  if (!fs.existsSync(envFilePath)) {
    fs.writeFileSync(envFilePath, `${initialVariable}\n`, { encoding: 'utf8' });
    console.log(`Created ${envFilePath} with initial variable.`);
  } else {
    const envContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });
    if (!envContent.includes('GOOGLE_APPLICATION_CREDENTIALS=')) {
      fs.appendFileSync(envFilePath, `${initialVariable}\n`, { encoding: 'utf8' });
      console.log(`Added initial variable to ${envFilePath}.`);
    }
  }
};

initializeEnvironment();


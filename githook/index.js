const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const GITHUB_SECRET = process.env.GITHUB_SECRET;

app.use(bodyParser.raw({ type: 'application/json' }));

const createHmacSignature = (req) => {
  return crypto
    .createHmac('sha256', GITHUB_SECRET)
    .update(req.body)
    .digest('hex');
}

function compareSignatures(signature, comparisonSignature) {
  if (signature.length !== comparisonSignature.length) {
    console.error('Signature lengths do not match:', signature.length, comparisonSignature.length);
    return false;
  }

  const source = Buffer.from(signature, 'hex');
  const comparison = Buffer.from(comparisonSignature, 'hex');
  return crypto.timingSafeEqual(source, comparison);
}

const verifyGitHubSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return res.status(400).send('Missing signature');

  const hmac = 'sha256=' + createHmacSignature(req);

  console.log('Received signature:', signature);
  console.log('Calculated HMAC:', hmac);

  const matched = compareSignatures(signature, hmac);

  if (!matched) return res.status(400).send('Signature mismatched.');

  next();
};

const runCommandsInShell = (commands) => {
  const command = commands.join(' && ');
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing commands: ${stderr}`);
      reject(stderr);
    } else {
      console.log(`Commands output: ${stdout}`);
      resolve(stdout);
    }
  });
};

const updateAndRestartServices = async () => {
  try {
    const commands = [
      'cd ../client && git pull && npm install && npm run build',
      'cd ../server && npm install',
      'sudo systemctl daemon-reload',
      'sudo systemctl enable filmpin.service',
      'sudo systemctl restart filmpin.service',
      'sudo systemctl enable filmpinclient.service',
      'sudo systemctl restart filmpinclient.service',
      'sudo systemctl restart caddy'
    ];
    await runCommandsInShell(commands);
  } catch (error) {
    console.error('Failed to update and restart services:', error);
    throw error;
  }
};

app.get('/', (_, res) => res.sendStatus(200));

app.post('/webhook', verifyGitHubSignature, async (req, res) => {
  try {
    updateAndRestartServices();
    res.status(200).send('Success');
  } catch (error) {
    res.status(500).send('Error updating services');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening for webhooks on port ${PORT}`);
});

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

  const hmac = createHmacSignature(req);

  console.log('Received signature:', signature);
  console.log('Calculated HMAC:', hmac);

  const matched = compareSignatures(signature, hmac);

  if (!matched) return res.status(400).send('Signature mismatched.');
  
  next();
};

app.post('/webhook', verifyGitHubSignature, (req, res) => {
  exec('cd ../client && git pull && npm install && npm run build && cd ../server && npm install && sudo systemctl restart filmpin.service && sudo systemctl restart filmpinclient.service && sudo systemctl restart caddy', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error pulling repo: ${stderr}`);
      res.status(500).send('Error pulling repo');
      return;
    }
    console.log(`Repo pulled and server restarted: ${stdout}`);
    res.status(200).send('Success');
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening for webhooks on port ${PORT}`);
});

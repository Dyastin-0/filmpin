const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse the raw body for signature verification
app.use(bodyParser.raw({ type: 'application/json' }));

const GITHUB_SECRET = process.env.GITHUB_SECRET;

const verifyGitHubSignature = (req, res, next) => {
    const signature = req.headers['x-hub-signature-256']; // GitHub uses this header for the SHA-256 signature
    if (!signature) {
        return res.status(401).send('No signature provided');
    }

    // Create HMAC and compute digest using the raw body Buffer
    const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
    const digest = `sha256=${hmac.update(req.body).digest('hex')}`; // Use raw body directly

    // Compare the computed digest with the signature from GitHub
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        return next();
    } else {
        return res.status(401).send('Invalid signature');
    }
}

app.post('/webhook', verifyGitHubSignature, (req, res) => {
    exec('cd ../client && git pull && npm i && npm run build && cd ../server && npm i && sudo systemctl restart filmpin.service && systemctl restart filmpinclient.service && systemctl restart caddy', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error pulling repo: ${stderr}`);
            res.status(500).send('Error');
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

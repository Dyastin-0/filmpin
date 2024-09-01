const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.raw({ type: 'application/json' }));

const GITHUB_SECRET = process.env.GITHUB_SECRET;

const encoder = new TextEncoder();

async function verifySignature(secret, header, payload) {
    let parts = header.split('=');
    let sigHex = parts[1];

    let algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };

    let keyBytes = encoder.encode(secret);
    let extractable = false;
    let key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        algorithm,
        extractable,
        [ 'sign', 'verify' ],
    );

    let sigBytes = hexToBytes(sigHex);
    let dataBytes = encoder.encode(payload);
    let equal = await crypto.subtle.verify(
        algorithm.name,
        key,
        sigBytes,
        dataBytes,
    );

    return equal;
}

function hexToBytes(hex) {
    let len = hex.length / 2;
    let bytes = new Uint8Array(len);

    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }

    return bytes;
}

const verifyGitHubSignature = async (req, res, next) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        return res.status(401).send('No signature provided');
    }

    try {
        const isValid = await verifySignature(GITHUB_SECRET, signature, req.body);
        if (isValid) {
            return next();
        } else {
            return res.status(401).send('Invalid signature');
        }
    } catch (error) {
        console.error('Signature verification error:', error);
        return res.status(500).send('Error verifying signature');
    }
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

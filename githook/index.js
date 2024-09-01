const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json({
    verify: (req, _, buf, encoding) => {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    },
}));

const sigHeaderName = 'x-hub-signature-256';
const sigHashAlg = 'sha256';
const GITHUB_SECRET = process.env.GITHUB_SECRET;

const verifyGitHubSignature = (req, res, next) => {
    if (!req.rawBody) return res.status(400).send('No body found');

    const signature = req.get(sigHeaderName);
    if (!signature) return res.status(400).send('No signature provided');

    const hmac = crypto.createHmac(sigHashAlg, GITHUB_SECRET);
    const digest = `sha256=${hmac.update(req.rawBody).digest('hex')}`;

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        return next();
    } else {
        return res.status(401).send('Invalid signature');
    }
};

app.post('/webhook', verifyGitHubSignature, (_, res) => {
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

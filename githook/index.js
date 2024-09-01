const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.raw({ type: 'application/json' }));

const GITHUB_SECRET = process.env.GITHUB_SECRET;

const verifyGitHubSignature = (req, res, next) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature)
        return res.status(401).send('No signature provided');

    const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
    const digest = `sha256=${hmac.update(req.body).digest('hex')}`;

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

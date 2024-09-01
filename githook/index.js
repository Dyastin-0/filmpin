const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
    // Handle the webhook
    exec('cd filmpin/client && git pull && npm i && npm run build && cd ../server && npm i && sudo systemctl restart filmpin.service && systemctl restart filmpinclient.service && systemctl restart caddy', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error pulling repo: ${stderr}`);
            res.status(500).send('Error');
            return;
        }
        console.log(`Repo pulled and server restarted: ${stdout}`);
        res.status(200).send('Success');
    });
});

app.listen(4000, () => {
    console.log('Listening for webhooks on port 4000');
});

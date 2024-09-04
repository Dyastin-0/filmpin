const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const { verifyGitHubSignature } = require('./middlewares/githubSignature');
const { handleGithook } = require('./controllers/githook');

const app = express();
app.use(bodyParser.raw({ type: 'application/json' }));

app.get('/', (_, res) => res.sendStatus(200));

app.post('/githook', verifyGitHubSignature, handleGithook);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening for webhooks on port ${PORT}`);
});

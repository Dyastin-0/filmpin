const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { verifyGitHubSignature } = require('./middlewares/githubSignature');
const { runCommandsInShell } = require('./helpers/childExec');

dotenv.config();
const app = express();
app.use(bodyParser.raw({ type: 'application/json' }));

const hasChangesInDirectory = (commits, directory) => {
  return commits.some(commit =>
    commit.modified.concat(commit.added, commit.removed).some(file => file.startsWith(directory))
  );
};

const updateAndRestartServices = (commits) => {
  const commands = ['cd .. git pull'];

  if (hasChangesInDirectory(commits, 'client/')) {
    console.log('client/')
    commands.push('cd ../client && npm install && npm run build');
    commands.push('sudo systemctl restart filmpinclient.service');
  }

  if (hasChangesInDirectory(commits, 'server/')) {
    console.log('server/')
    commands.push('cd ../server && npm install');
    commands.push('sudo systemctl restart filmpin.service');
  }

  if (commands.length > 0) {
    commands.push('sudo systemctl restart caddy');
    runCommandsInShell(commands);
  } else {
    console.log('No relevant changes detected, no services restarted.');
  }
};

app.get('/', (_, res) => res.sendStatus(200));

app.post('/webhook', verifyGitHubSignature, (req, res) => {
  try {
    const payload = JSON.parse(req.body);
    const commits = payload.commits || [];
    updateAndRestartServices(commits);
    res.status(200).send('Success');
  } catch (error) {
    console.error('Failed to process webhook:', error);
    res.status(500).send('Error updating services');
  }
});

app.get('/webhook', verifyGitHubSignature, (req, res) => {
  try {
    const payload = JSON.parse(req.body);
    const commits = payload.commits || [];
    updateAndRestartServices(commits);
    res.status(200).send('Success');
  } catch (error) {
    console.error('Failed to process webhook:', error);
    res.status(500).send('Error updating services');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening for webhooks on port ${PORT}`);
});

const { runCommandsInShell } = require('../helpers/childExec');

const hasChangesInDirectory = (commits, directory) => {
  return commits.some(commit =>
    commit.modified.concat(commit.added, commit.removed).some(file => file.startsWith(directory))
  );
};

const updateAndRestartServices = (commits) => {
  const commands = ['cd .. && git pull'];

  if (hasChangesInDirectory(commits, 'client/')) {
    console.log('client/');
    commands.push('cd client && npm install && npm run build && cd ..');
    commands.push('sudo systemctl restart filmpinclient.service');
  }

  if (hasChangesInDirectory(commits, 'server/')) {
    console.log('server/');
    commands.push('cd server && npm install && npm run init && cd ..');
    commands.push('sudo systemctl restart filmpin.service');
  }

  if (commands.length > 1) {
    commands.push('sudo systemctl restart caddy');
    runCommandsInShell(commands);
  } else {
    console.log('No relevant changes detected, no services restarted.');
  }
};

const handleGithook = (req, res) => {
	try {
		const payload = JSON.parse(req.body);
		const commits = payload.commits || [];
		updateAndRestartServices(commits);
		res.status(200).send('Success');
	} catch (error) {
		console.error('Failed to update services:', error);
		res.status(500).send('Failed to update services.');
	}
}

module.exports = {
	handleGithook
}
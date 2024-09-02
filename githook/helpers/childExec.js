const { exec } = require('child_process');

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

module.exports = {
	runCommandsInShell
}
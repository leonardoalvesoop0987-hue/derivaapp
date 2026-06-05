const { spawn } = require('child_process');

const child = spawn('npx.cmd', ['prisma', 'migrate', 'dev', '--name', 'decks-unlocks-dark-content'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
});

child.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  if (output.toLowerCase().includes('yes')) {
    console.log('Sending yes...');
    child.stdin.write('y\n');
  }
});

child.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});

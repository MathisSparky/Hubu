const { execSync } = require('child_process');

console.log('\x1b[33mInstalling dependencies...\x1b[0m');
execSync('npm install', { stdio: 'inherit' });
console.log('\x1b[32mDependencies installed successfully.\x1b[0m');
const { createHash } = require('crypto');
const { readFileSync } = require('fs');
const { join } = require('path');

/** Path to the project directory. */
const projectDir = join(__dirname, '../');

if (module === require.main) {
  generateHashFromFiles(process.argv.slice(2));
}

function generateHashFromFiles(files) {
  if (!files || !files.length) {
    console.error('No files provided to the hash function!');
    process.exit(1);
  }

  const hash = createHash('sha512');
  files.forEach(f => {
    const file = join(projectDir, f);
    const content = readFileSync(file, 'utf8');
    hash.write(content);
  });

  const generatedHash = hash.digest('base64');
  console.log(generatedHash);
}

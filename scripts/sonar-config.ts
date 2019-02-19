import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const sonarConfigPath = resolve(__dirname, '../sonar-project.properties');
const version = require('../package.json').version;
const branch = process.env.BRANCH_NAME || 'develop';
console.log(`Sonar Config: Set version (${version}) and branch (${branch})`);
const sonarConfig = readFileSync(sonarConfigPath, 'utf8')
    .replace(/sonar.projectVersion=[^\r\n]*/g, `sonar.projectVersion=${version}`)
    .replace(/sonar.branch=[^\r\n]*/g, `sonar.branch=${branch}`);
writeFileSync(sonarConfigPath, sonarConfig, 'utf8');

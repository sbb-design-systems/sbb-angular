import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const sonarConfigPath = resolve(__dirname, '../sonar-project.properties');
const version = require('../package.json').version;
const sonarConfig = readFileSync(sonarConfigPath, 'utf8')
    .replace(/sonar\.projectVersion=[^\r\n]/g, `sonar.projectVersion=${version}`)
    .replace(/sonar\.branch=[^\r\n]/g, `sonar.branch=${process.env.BRANCH_NAME || 'develop'}`);
writeFileSync(sonarConfigPath, sonarConfig, 'utf8');

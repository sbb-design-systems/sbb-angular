const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const pkg = require('../package.json');

const sonarParams = {
  'sonar.projectKey': pkg.name,
  'sonar.projectName': pkg.name,
  'sonar.projectVersion': pkg.version,
  'sonar.links.homepage': pkg.homepage,
  'sonar.links.issues': pkg.bugs.url,
  'sonar.links.scm': pkg.repository.url
};

const sonarPropertiesFile = join(__dirname, '../sonar-project.properties');
const sonarConfig = readFileSync(sonarPropertiesFile, 'utf8');
const adaptedSonarConfig = Object.entries(sonarParams).reduce(
  (current, [key, value]) => `${current}\n${key}=${value}`,
  sonarConfig
);
writeFileSync(sonarPropertiesFile, adaptedSonarConfig, 'utf8');

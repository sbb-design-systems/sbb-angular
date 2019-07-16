const sonarqubeScanner = require('sonarqube-scanner');

if (process.env.SONAR_TOKEN) {
  new Promise(resolve =>
    sonarqubeScanner(
      {
        serverUrl: 'https://sonarcloud.io',
        token: process.env.SONAR_TOKEN,
        options: {
          'sonar.branch': process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.TRAVIS_BRANCH
        }
      },
      resolve
    )
  );
}

const path = require('path');
const { customLaunchers, platformMap } = require('./browser-providers');

module.exports = (config) => {
  config.set({
    basePath: path.join(__dirname, '..'),
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-browserstack-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-sonarqube-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        timeout: 100000,
      },
    },
    browserStack: {
      project: `@sbb-esta/${packageName} Unit Tests`,
      startTunnel: true,
      retryLimit: 3,
      timeout: 1800,
      video: false,
    },
    sonarqubeReporter: {
      basePath: `projects/sbb-esta/${packageName}`,
      outputFolder: dist,
      reportName: () => 'sonarqube.xml',
    },
    coverageIstanbulReporter: {
      dir: dist,
      reports: ['html', 'lcovonly', 'cobertura'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['progress', 'kjhtml', 'sonarqube'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: require('../browsers.json'),
    singleRun: false,
    // Try Websocket for a faster transmission first. Fallback to polling if necessary.
    transports: ['websocket', 'polling'],
    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 1,
  });

  if (process.env.GITHUB_WORKSPACE) {
    config.reporters = config.reporters
      .filter((r) => r !== 'progress' && r !== 'kjhtml')
      .concat('dots');
    config.coverageIstanbulReporter.reports = config.coverageIstanbulReporter.reports.filter(
      (r) => r !== 'html'
    );

    // This defines how often a given browser should be launched in the same GitHub
    // container. This is helpful if we want to shard tests across the same browser.
    const parallelBrowserInstances = Number(process.env.KARMA_PARALLEL_BROWSERS) || 1;

    // In case there should be multiple instances of the browsers, we need to set up the
    // the karma-parallel plugin.
    if (parallelBrowserInstances > 1) {
      config.frameworks.unshift('parallel');
      config.plugins.push(require('karma-parallel'));
      config.parallelOptions = {
        executors: parallelBrowserInstances,
        shardStrategy: 'round-robin',
      };
    }

    if (process.env.BROWSERSTACK_USERNAME && process.env.BROWSERSTACK_ACCESS_KEY) {
      config.browserDisconnectTimeout = 180000;
      config.browserDisconnectTolerance = 3;
      config.captureTimeout = 180000;
    }
  }
};

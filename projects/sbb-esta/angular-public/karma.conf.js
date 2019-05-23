// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

if (process.env.CONTINUOUS_INTEGRATION) {
  process.env.CHROME_BIN = require('puppeteer').executablePath();
}

module.exports = function(config) {
  const dist = require('path').join(
    __dirname,
    '../../../coverage/sbb-esta/angular-public'
  );
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-browserstack-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-sonarqube-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-sourcemap-loader'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        timeout: 100000
      }
    },
    browserStack: {
      project: '@sbb-esta/angular-public Unit Tests',
      startTunnel: false,
      retryLimit: 3,
      timeout: 1800,
      video: false
    },
    junitReporter: {
      outputDir: dist,
      suite: 'unit-tests',
      outputFile: 'unit-tests.xml',
      useBrowserName: false
    },
    sonarqubeReporter: {
      basePath: 'projects/sbb-esta/angular-public/src',
      outputFolder: dist,
      reportName: () => 'sonarqube.xml'
    },
    coverageIstanbulReporter: {
      dir: dist,
      reports: ['html', 'lcovonly', 'cobertura'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'junit', 'sonarqube'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      },
      BsChrome: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Chrome'
      }
    },
    singleRun: false,
    // Try Websocket for a faster transmission first. Fallback to polling if necessary.
    transports: ['websocket', 'polling'],
    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 1
  });

  if (process.env.TRAVIS) {
    // This defines how often a given browser should be launched in the same Travis
    // container. This is helpful if we want to shard tests across the same browser.
    const parallelBrowserInstances =
      Number(process.env.KARMA_PARALLEL_BROWSERS) || 1;

    // In case there should be multiple instances of the browsers, we need to set up the
    // the karma-parallel plugin.
    if (parallelBrowserInstances > 1) {
      config.frameworks.unshift('parallel');
      config.plugins.push(require('karma-parallel'));
      config.parallelOptions = {
        executors: parallelBrowserInstances,
        shardStrategy: 'round-robin'
      };
    }

    if (
      process.env.BROWSERSTACK_USERNAME &&
      process.env.BROWSERSTACK_ACCESS_KEY
    ) {
      const tunnelIdentifier = process.env.BROWSERSTACK_LOCAL_IDENTIFIER;
      const buildIdentifier = `sbb-angular-travis-ci-${tunnelIdentifier}`;
      config.browserStack.build = buildIdentifier;
      config.browserStack.tunnelIdentifier = tunnelIdentifier;
      config.browserDisconnectTimeout = 180000;
      config.browserDisconnectTolerance = 3;
      config.captureTimeout = 180000;
    }
  }
};

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
    singleRun: false,
    restartOnFileChange: true,
    captureTimeout: 100000,
    browserNoActivityTimeout: 100000,
    browserDisconnectTimeout: 100000,
    browserDisconnectTolerance: 3
  });
};

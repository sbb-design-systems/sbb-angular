// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-browserstack-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    customLaunchers: {
      // https://www.browserstack.com/automate/capabilities
      bsChromeWindows: {
        base: 'BrowserStack',
        browser: 'Chrome',
        os: 'Windows',
        os_version: '10',
      },
      bsFirefoxWindows: {
        base: 'BrowserStack',
        browser: 'Firefox',
        os: 'Windows',
        os_version: '10',
      },
    },
    browsers: process.env.BROWSER_STACK_ACCESS_KEY && process.env.BROWSER_STACK_USERNAME
      ? ['bsChromeWindows', 'bsFirefoxWindows'] : ['Chrome'],
    singleRun: false
  });
};
module.exports = (config) => {
  const testOutputFile = process.env.XML_OUTPUT_FILE;
  if (testOutputFile) {
    const { dirname, basename } = require('path');
    const outputDir = dirname(testOutputFile);
    config.set({
      reporters: ['junit'],
      junitReporter: {
        outputDir,
        outputFile: basename(testOutputFile),
        useBrowserName: false,
      },
    });
  }
};

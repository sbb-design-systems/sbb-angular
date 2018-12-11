const { SvgConverter } = require('./svg-converter');

const [,, basePath, destinationPath] = process.argv;

const converter = new SvgConverter(basePath, destinationPath);
converter.convert();

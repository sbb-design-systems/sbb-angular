const { SvgConverter } = require('./svg-converter');

const [,, basePath, destinationPath, listPath] = process.argv;

const converter = new SvgConverter(basePath, destinationPath, listPath);
converter.convert();

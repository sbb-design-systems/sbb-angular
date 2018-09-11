const fs = require('fs');
const _ = require('lodash');
const iconAngularTemplate = require('./component-template.ts');
const svgoConfiguration = require('./svgo-configuration.ts');
const path = 'svgs';
const baseOutputPath = 'src/lib/svg-icons-components';
const iconSelectorPrefix = 'sbb-icon-';

/**
 * Creates a normalized SVG Icon Angular Component starting from a SVG file.
 * Source SVG mark-up is cleaned up making it compatible with most of browsers.
 * @param fileName File name of the source SVG
 * @return Icon Object containing the new SVG Angular Component itself and the relative filename
 **/
function createSvgIconsComponent(fileName) {
  const svgIcon = fs.readFileSync(fileName, 'utf8');
  const normalizedIconName = normaliseIconNames(fileName.substr(fileName.lastIndexOf('/') + 1));
  const iconSelector = iconSelectorPrefix + normalizedIconName.toLowerCase();
  return normaliseSvg(svgIcon).then((optimizedSVG) => {
    const iconComponentName = 'Icon' + _.upperFirst(_.camelCase(normalizedIconName)) + 'Component';
    const svgComponent = iconAngularTemplate.getTemplate(iconSelector, optimizedSVG.data, iconComponentName);
    const iconObject = {
      file: svgComponent,
      fileName: iconSelector + '.component.ts'
    };
    return iconObject;
  });
}

/**
 * Handles various type of input SVG input file names to create a normalized Icon Name
 * @param svgPathWithUnderscores File name of the source SVG
 * @return normalized filename
 **/
function normaliseIconNames(svgPathWithUnderscores) {
  const stdIconName = svgPathWithUnderscores
    // removes ".svg" extension
    .substring(0, svgPathWithUnderscores.length - 4)
    .replace(new RegExp('SBB_'), '')
    .replace(new RegExp('(XX_|[0-9]+_[0-9]+_|[0-9]+_)'), '')
    .replace(new RegExp('_', 'g'), '-');
  return stdIconName;
}

/**
 * Normalizes SVG mark-up, optimizing the content for cross-browser compatibility.
 * "svgo" library is used for the scope with configured options findable in svgo-configuration.ts
 * @param svgIconSource Source SVG mark-up
 * @return normalized SVG mark-up
 **/
function normaliseSvg(svgIconSource) {
  return svgoConfiguration.svgo.optimize(svgIconSource);
}

/**
 * Writes the Angular Icon component into the proper directory, and with the proper filename.
 * @param outputPath base output path
 * @param outputPath icon object containing also the filename
 **/
function writeComponentOnFile(outputPath, iconObject) {
  fs.writeFileSync(outputPath + '/' + iconObject.fileName, iconObject.file);
}

/**
 * Recursive function that takes a input SVGs folder and creates Angular Icon Components using the same folder structure
 * @param baseDir source SVGs input directory
 * @param outputPath base output path where Angular Icon Components will be written
 */
function buildIconsLibrary(baseDir, outputPath) {
  const files = fs.readdirSync(baseDir);
  files.forEach(file => {
    const stats = fs.statSync(baseDir + '/' + file);
    if (stats.isFile()) {
      createSvgIconsComponent(baseDir + '/' + file).then((iconObject) => {
        writeComponentOnFile(outputPath, iconObject);
      });
    } else {
      if (!fs.existsSync(outputPath + '/' + file)) {
        fs.mkdirSync(outputPath + '/' + file);
      }
      buildIconsLibrary(baseDir + '/' + file, outputPath + '/' + file);
    }
  });

}

buildIconsLibrary(path, baseOutputPath);

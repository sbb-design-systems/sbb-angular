const fs = require('fs');
const _ = require('lodash');
const iconAngularTemplate = require('./component-template.ts');
const svgoConfiguration = require('./svgo-configuration.ts');
const path = 'svgs';
const baseOutputPath = 'src/lib/svg-icons-components';
const iconSelectorPrefix = 'sbb-icon-';

function createSvgIconsComponent(fileName) {
  const svgIcon = fs.readFileSync(fileName, 'utf8');
  const normalizedIconName = normalizeIconNames(fileName.substr(fileName.lastIndexOf('/') + 1));
  const iconSelector = iconSelectorPrefix + normalizedIconName.toLowerCase();
  return normalizeSvg(svgIcon).then((optimizedSVG) => {
    const iconComponentName = 'Icon' + _.upperFirst(_.camelCase(normalizedIconName)) + 'Component';
    const svgComponent = iconAngularTemplate.getTemplate(iconSelector, optimizedSVG.data, iconComponentName);
    const iconObject = {
      file: svgComponent,
      fileName: iconSelector + '.component.ts'
    };
    return iconObject;
  });
}

function normalizeIconNames(svgPathWithUnderscores) {
  const stdIconName = svgPathWithUnderscores
    // removes ".svg" extension
    .substring(0, svgPathWithUnderscores.length - 4)
    .replace(new RegExp('SBB_'), '')
    .replace(new RegExp('(XX_|[0-9]+_[0-9]+_|[0-9]+_)'), '')
    .replace(new RegExp('_', 'g'), '-');
  return stdIconName;
}

function normalizeSvg(svgIconSource) {
  return svgoConfiguration.svgo.optimize(svgIconSource);
}

function writeComponentOnFile(outputPath, iconObject) {
  fs.writeFileSync(outputPath + '/' + iconObject.fileName, iconObject.file);
}

function findSecondIndex(svgPathWithUnderscores) {
  return svgPathWithUnderscores.indexOf('_', (svgPathWithUnderscores.indexOf('_') + 1));
}

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

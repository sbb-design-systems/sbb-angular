const fs = require('fs');
const _ = require('lodash');
const angularTemplates = require('./script-templates.js');
const svgoConfiguration = require('./svgo-configuration.js');
const supportLibrary = require('./support-libray.js');

/**
 * Creates a normalized SVG Icon Angular Component starting from a SVG file.
 * Source SVG mark-up is cleaned up making it compatible with most of browsers.
 * @param fileName File name of the source SVG
 * @return Icon Object containing the new SVG Angular Component itself and the relative filename
 **/
function createSvgIconsComponent(fileName) {

  const svgIcon = fs.readFileSync(fileName, 'utf8');
  const normalizedIconName = normaliseIconNames(fileName.substr(fileName.lastIndexOf('/') + 1));
  const iconSelector = scriptConfiguration.iconSelectorPrefix + normalizedIconName.toLowerCase();
  return normaliseSvg(svgIcon).then((optimizedSVG) => {
    const optimizedSvgAngularTemplate = decorateSvgWithAttrs(optimizedSVG.data);
    const iconComponentName = 'Icon' + _.upperFirst(_.camelCase(normalizedIconName)) + 'Component';
    const svgComponent = angularTemplates
      .getTemplate(iconSelector, optimizedSvgAngularTemplate, iconComponentName, scriptConfiguration.svgClass);
    const iconObject = {
      content: svgComponent,
      fileName: iconSelector + '.component.ts',
      name: iconComponentName,
      selector: iconSelector,
      svgTemplate: optimizedSvgAngularTemplate,
      sourceFileName: fileName
    };
    return iconObject;
  });
}

/**
 * Adds custom attributes to the SVG usable with Angular
 * @param optimizedSVGTemplate source SVG template
 */
function decorateSvgWithAttrs(optimizedSVGTemplate) {
  return optimizedSVGTemplate.replace('<svg', '<svg [attr.class]="svgClass + commonClass"');
}

/**
 * Handles various types of SVG input file names to create a normalized Icon Name
 * @param svgPathWithUnderscores File name of the source SVG
 * @return normalized filename
 **/
function normaliseIconNames(svgPathWithUnderscores) {
  const stdIconName = svgPathWithUnderscores
    // removes ".svg" extension
    .substring(0, svgPathWithUnderscores.length - 4)
    .replace(new RegExp('SBB_[0-9]+_[0-9]+_', 'i'), '')
    .replace(new RegExp('SBB_[0-9]+_', 'i'), '')
    .replace(new RegExp('SBB_', 'i'), '')
    .replace(new RegExp('(XX_)', 'i'), '')
    .replace(new RegExp('_', 'g'), '-');
  return stdIconName;
}

/**
 * Normalizes SVG mark-up, optimizing the content for cross-browser compatibility.
 * [svgo](https://github.com/svg/svgo) library is used for the scope with configured options findable in svgo-configuration.ts
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
  fs.writeFileSync(outputPath + '/' + iconObject.fileName, iconObject.content);
}

function isAlreadyExistentModuleName(newModuleName, modules) {
  return !_.isUndefined(_.find(modules, (module) => {
    return module.name === newModuleName;
  }));
}

function isFileExcluded(file, discardedFiles) {
  if (!!scriptConfiguration.excludeFileWith) {
    return !!file.match(new RegExp(scriptConfiguration.excludeFileWith, 'g'));
  }
  return false;
}

/**
 * Recursive function that takes a input SVGs folder and creates Angular Icon Components using the same folder structure
 * @param baseDir source SVGs input directory
 * @param outputPath base output path where Angular Icon Components will be written
 */
function buildIconsLibrary(baseDir, outputPath, modules, promises, outputStats) {
  const files = fs.readdirSync(baseDir);
  files.forEach(file => {

    const stats = fs.statSync(baseDir + '/' + file);
    if (stats.isFile()) {
      if (!isFileExcluded(file)) {
        outputStats.sourceSVGs.push(file);
        promises.push(createSvgIconsComponent(baseDir + '/' + file).then((iconObject) => {
          const alreadyExistentComponent = _.find(outputStats.createdComponents, function (o) {
            return o.selector === iconObject.selector;
          });
          if (_.isUndefined(alreadyExistentComponent)) {
            writeComponentOnFile(outputPath, iconObject);
            const splitPath = baseDir.split('/');
            const lastFolder = splitPath[splitPath.length - 1];
            if (_.isUndefined(modules[baseDir])) {

              let actualModuleName = 'Icon' + _.upperFirst(_.camelCase(lastFolder)) + 'Module';
              if (isAlreadyExistentModuleName(actualModuleName, modules)) {
                actualModuleName = 'Icon' + _.upperFirst(_.camelCase(splitPath[splitPath.length - 2] + '_' + lastFolder)) + 'Module';
              }
              modules[baseDir] = {
                components: [],
                path: outputPath,
                name: actualModuleName,
                fileName: 'sbb-icon-' + _.kebabCase(lastFolder) + '.module.ts'
              };
            }
            outputStats.createdComponents.push(iconObject);
            modules[baseDir].components.push(iconObject);
          } else {
            outputStats.discardedComponents.push({ 'discarded': iconObject, 'included': alreadyExistentComponent });
          }
        }));
      } else {
        outputStats.discardedFiles.push(file);
      }
    } else {
      if (!fs.existsSync(outputPath + '/' + file)) {
        fs.mkdirSync(outputPath + '/' + file);
      }
      buildIconsLibrary(baseDir + '/' + file, outputPath + '/' + file, modules, promises, outputStats);
    }

  });
  return promises;
}

/**
 * Writes the Angular Icon Module into the proper directory, and with the proper filename.
 * @param outputPath base output path
 * @param outputPath icon object containing also the filename
 **/
function writeModuleOnFile(modulePath, moduleContent) {
  fs.writeFileSync(modulePath, moduleContent);
}

/**
 **/
function buildLibraryModules(modules) {
  _.forEach(modules, function (module, folderName) {
    writeModuleOnFile(module.path + '/' + module.fileName, angularTemplates.getModuleTemplate(module.name, module.components));
  });
}

function buildCommonIconModule(basePath, modules) {
  writeModuleOnFile(basePath + '/icon-common.module.ts', angularTemplates.getCommonModuleTemplate(basePath, modules), basePath);
}

function createPublicApiFile(modules) {
  const publicApiSourceFile = './src/public_api_icons.ts';
  const publicApiExports = [];
  _.forEach(modules, function (module, moduleKey) {
    publicApiExports.push('// tslint:disable-next-line:max-line-length');
    publicApiExports.push('export * from \'' + module.path.replace('src/', './') + '/' + module.fileName.replace('.ts', '') + '\';');
    _.forEach(module.components, function (component) {
      publicApiExports.push('// tslint:disable-next-line:max-line-length');
      publicApiExports.push('export * from \'' + module.path.replace('src/', './') + '/' + component.fileName.replace('.ts', '') + '\';');
    });
  });
  let publicApiOutput = publicApiExports.join('\n');
  publicApiOutput += '\nexport * from \'./lib/svg-icons-components/icon-common.module\';\n';
  // publicApiOutput += `export * from './lib/sbb-components-mapping';\n`; 
  fs.writeFileSync(publicApiSourceFile, publicApiOutput);

}

function createComponentsMappingClass(createdComponents) {
  const componentsSourceFile = '../../src/app/sbb-components-mapping.ts';
  const exportClassStartStatement = 'export class SBBComponentsMapping {\nconstructor() {}\n';
  const objectFileStart = 'static icons = [\n';
  const objectFileEnd = '];\n';
  const exportClassEndStatement = '}\n';
  const objectEntries = [];
  _.forEach(createdComponents, function (component) {
    const path = _.map(component.sourceFileName.split('/').slice(1, -1), function (tag) {
      return ' \'' + tag + '\'';
    });
    objectEntries.push('{\n\'selector\': \'' + component.selector + '\',\n\'name\': \'' + component.name + '\',\n\'tags\': [' + path + ']\n}');
  });

  const outputData = exportClassStartStatement + objectFileStart + objectEntries.join(',\n') + objectFileEnd + exportClassEndStatement;
  fs.writeFileSync(componentsSourceFile, outputData);
}

function createComponentsExportMap(createdComponents) {
  const outputFile = '../../src/app/sbb-components-mapping-export.ts';
  const startImport = 'import {\n';
  const endImport = '} from \'sbb-angular\';\n';
  const importStatement = startImport + _.map(createdComponents, function (component) {
    return component.name;
  }).join(',\n') + endImport;

  const mapStart = 'const map = {\n';
  const mapStatement = _.map(createdComponents, function (component) {
    return `'${component.name}': ${component.name}`;
  }).join(',\n')
  const mapEnd = '};'

  const map = mapStart + mapStatement + mapEnd;
  const output = `${importStatement}\n${map}\n export { map };\n`;
  fs.writeFileSync(outputFile, output);


}

const scriptConfiguration = {
  svgBasePath: 'svgs',
  baseOutputPath: 'src/lib/svg-icons-components',
  iconSelectorPrefix: 'sbb-icon-',
  svgClass: '',
  excludeFileWith: ''
};


function init() {
  supportLibrary.processArgumentsCheck(scriptConfiguration);
  const modules = {};
  const promises = [];
  const outputStats = {
    'createdComponents': [],
    'discardedComponents': [],
    'sourceSVGs': [],
    'discardedFiles': []
  };
  Promise.all(buildIconsLibrary(scriptConfiguration.svgBasePath, scriptConfiguration.baseOutputPath, modules, promises, outputStats)).then(() => {
    buildLibraryModules(modules);
    buildCommonIconModule(scriptConfiguration.baseOutputPath, modules);
    supportLibrary.outputStatsPrint(modules, outputStats);
    createPublicApiFile(modules);
    createComponentsMappingClass(outputStats.createdComponents);
    createComponentsExportMap(outputStats.createdComponents);
  }).catch(err => {
    console.log(err);
  });
}

init();

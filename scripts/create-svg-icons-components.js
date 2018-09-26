const fs = require('fs');
const _ = require('lodash');
const angularTemplates = require('./script-templates.js');
const svgoConfiguration = require('./svgo-configuration.js');
const supportLibrary = require('./support-library.js');
const supportClasses = require('./support-classes.js');
const IconComponentInfo = supportClasses.IconComponentInfo;
const IconModuleInfo = supportClasses.IconModuleInfo;

const PROJECT_LIB_PATH = 'projects/sbb-angular/';

/**
 * Creates a normalized SVG Icon Angular Component starting from a SVG file.
 * Source SVG mark-up is cleaned up making it compatible with most of browsers.
 * @param fileName File name of the source SVG
 * @return Icon Object containing the new SVG Angular Component itself and the relative filename
 **/
async function createSvgIconsComponent(fileName) {

  const svgIcon = fs.readFileSync(fileName, 'utf8');
  const normalizedIconName = normaliseIconNames(fileName.substr(fileName.lastIndexOf('/') + 1));
  const iconSelector = scriptConfiguration.iconSelectorPrefix + normalizedIconName.toLowerCase();
  const optimizedSVG = await normaliseSvg(svgIcon);
  const optimizedSvgAngularTemplate = decorateSvgWithAttrs(optimizedSVG.data);
  const iconComponentName = 'Icon' + _.upperFirst(_.camelCase(normalizedIconName)) + 'Component';
  const svgComponent = angularTemplates
    .getTemplate(iconSelector, optimizedSvgAngularTemplate, iconComponentName, scriptConfiguration.svgClass);
  return new IconComponentInfo(svgComponent,
    iconSelector + '.component.ts',
    iconComponentName,
    iconSelector,
    optimizedSvgAngularTemplate,
    fileName);
}

/**
 * Adds custom attributes to the SVG usable with Angular
 * @param optimizedSVGTemplate source SVG template
 */
function decorateSvgWithAttrs(optimizedSVGTemplate) {
  return optimizedSVGTemplate.replace('<svg', '<svg [ngClass]="[svgClass, commonClass]"');
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
async function normaliseSvg(svgIconSource) {
  return await svgoConfiguration.svgo.optimize(svgIconSource);
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
 * @param modules will contain all the angular icon modules created in this function
 * @param outputStats will contain information about the components, files, and modules
 */
async function buildIconsLibrary(baseDir, outputPath, modules, outputStats) {
  const files = fs.readdirSync(baseDir);
  for (fileIndex in files) {
    const file = files[fileIndex];
    const stats = fs.statSync(baseDir + '/' + file);
    if (stats.isFile()) {
      if (!isFileExcluded(file)) {
        outputStats.sourceSVGs.push(file);
        const iconObject = await createSvgIconsComponent(baseDir + '/' + file);
        const alreadyExistentComponent = _.find(outputStats.createdComponents, (component) => {
          return component.selector === iconObject.selector;
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
            modules[baseDir] = new IconModuleInfo([], outputPath, actualModuleName, 'sbb-icon-' + _.kebabCase(lastFolder) + '.module.ts');
          }
          outputStats.createdComponents.push(iconObject);
          modules[baseDir].components.push(iconObject);
        } else {
          outputStats.discardedComponents.push({ 'discarded': iconObject, 'included': alreadyExistentComponent });
        }

      } else {
        outputStats.discardedFiles.push(file);
      }
    } else {
      if (!fs.existsSync(outputPath + '/' + file)) {
        fs.mkdirSync(outputPath + '/' + file);
      }
      await buildIconsLibrary(baseDir + '/' + file, outputPath + '/' + file, modules, outputStats);
    }
  }
  //);
}

/**
 * Writes the Angular Icon Module into the proper directory, and with the proper filename.
 * @param modulePath output module path
 * @param moduleContent angular module template filled with components information
 **/
function writeModuleOnFile(modulePath, moduleContent) {
  fs.writeFileSync(modulePath, moduleContent);
}

/**
 * Writes Angular Modules using the related template
 * @param modules Angular Icon modules with related components
 **/
function buildLibraryModules(modules) {
  _.forEach(modules, (module, folderName) => {
    writeModuleOnFile(module.path + '/' + module.fileName, angularTemplates.getModuleTemplate(module.name, module.components));
  });
}

/**
 * Writes the common angular module that will import all the other specific modules
 * @param modules Angular Icon modules with related components
 **/
function buildCommonIconModule(basePath, modules) {
  writeModuleOnFile(basePath + '/icon-common.module.ts', angularTemplates.getCommonModuleTemplate(basePath, modules), basePath);
}

/**
 * Creates and writes a public_api_icons.ts files to export outside the library all the icon components
 * @param modules Angular Icon modules with related components
 **/
function createPublicApiIconsFile(modules) {
  const publicApiSourceFile = scriptConfiguration.baseOutputPath + '/index.ts';
  fs.writeFileSync(publicApiSourceFile, angularTemplates.getPublicApiIconsFileTemplate(modules, PROJECT_LIB_PATH + 'src/lib/svg-icons-components/'));

}

/**
 * Writes the components mappings of all the icon components created.
 * This file will be used by the show case to load dinamically those components.
 * @param createdComponents Components already created to be mapped
 */
function createComponentsMappingClass(createdComponents, pathToExclude) {
  const componentsSourceFile = './src/app/sbb-components-mapping.ts';
  fs.writeFileSync(componentsSourceFile, angularTemplates.getComponentMappingTemplate(createdComponents, pathToExclude));
}

/**
 * This map written by this method is to be used in the showcase to create a service to be used for loading
 * icon dynamically using an angular Service
 * @param createdComponents
 */
function createComponentsExportMap(createdComponents) {
  const outputFile = './src/app/sbb-components-mapping-export.ts';
  fs.writeFileSync(outputFile, angularTemplates.getComponentsExportMapTemplate(createdComponents));
}

const scriptConfiguration = {
  svgBasePath: PROJECT_LIB_PATH + 'svgs',
  baseOutputPath: PROJECT_LIB_PATH + 'src/lib/svg-icons-components',
  iconSelectorPrefix: 'sbb-icon-',
  svgClass: '',
  excludeFileWith: ''
};

async function init() {
  supportLibrary.processArgumentsCheck(scriptConfiguration);
  const modules = {};
  const outputStats = {
    'createdComponents': [],
    'discardedComponents': [],
    'sourceSVGs': [],
    'discardedFiles': []
  };
  await buildIconsLibrary(scriptConfiguration.svgBasePath, scriptConfiguration.baseOutputPath, modules, outputStats);
  buildLibraryModules(modules);
  buildCommonIconModule(scriptConfiguration.baseOutputPath, modules);
  supportLibrary.outputStatsPrint(modules, outputStats);
  createPublicApiIconsFile(modules);
  createComponentsMappingClass(outputStats.createdComponents, scriptConfiguration.svgBasePath);
  createComponentsExportMap(outputStats.createdComponents);
}

init();

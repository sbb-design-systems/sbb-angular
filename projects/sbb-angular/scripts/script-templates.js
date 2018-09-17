const _ = require('lodash');

exports.getTemplate = function (iconSelector, iconTemplate, iconComponentName, svgClass) {
  return `import { Component, Input } from '@angular/core';
@Component({
  selector: '${iconSelector}',
  // tslint:disable-next-line:max-line-length
  template: '${iconTemplate}',
  styles: []
})
export class ${iconComponentName} {
  constructor() { }

  @Input() svgClass = '';
  commonClass = ' ${svgClass}';
}\n`;
};

exports.getModuleTemplate = function (moduleName, componentObjectsList) {
  const joinedComponentNames = _.map(componentObjectsList, function (componentObject) {
    return componentObject.name;
  }).join(', ');
  const componentImportsStatement = createImportsFromComponents(componentObjectsList).join('\n');
  return `import { NgModule } from '@angular/core';
${componentImportsStatement}

@NgModule({
  imports: [],
  // tslint:disable-next-line:max-line-length
  declarations: [${joinedComponentNames}],
  // tslint:disable-next-line:max-line-length
  exports: [${joinedComponentNames}],
  // tslint:disable-next-line:max-line-length
  entryComponents: [${joinedComponentNames}]
})
export class ${moduleName} { }
`;
};

exports.getCommonModuleTemplate = function (basePath, modules) {
  const joinedModuleNames = _.map(modules, function (module) {
    return module.name;
  }).join(', ');
  const modulesImportStatement = createImportsForCommonModule(modules, basePath).join('\n');
  return `import { NgModule } from '@angular/core';
${modulesImportStatement}

@NgModule({
  // tslint:disable-next-line:max-line-length
  imports: [${joinedModuleNames}],
  declarations: [],
  // tslint:disable-next-line:max-line-length
  exports: [${joinedModuleNames}]
})
export class IconCommonModule { }
`;
};

function createImportsFromComponents(componentObjectsList) {
  return _.map(componentObjectsList, function (componentObject) {
    return `import { ${componentObject.name} } from './${componentObject.fileName.replace('\.ts', '')}';`;
  });
}

function createImportsForCommonModule(modules, basePath) {
  return _.map(modules, function (module) {
    const relativePath = module.path.substring(basePath.length + 1);
    return `import { ${module.name} } from './${relativePath + '/' + module.fileName.replace('\.ts', '')}';`;
  });
}



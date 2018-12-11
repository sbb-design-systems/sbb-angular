const { writeFile } = require('fs');
const { join } = require('path');
const writeFileAsync = require('util').promisify(writeFile);

class IconModule {
  constructor(modules) {
    this.modules = modules;
  }

  get kebabCaseName() {
    return this._kebabCaseName || (this._kebabCaseName = this._normaliseName());
  }

  get pascalCaseName() {
    return this._pascalCaseName ||
      (this._pascalCaseName = this.kebabCaseName
        .replace(/-(\w)/g, (_, m) => m.toUpperCase())
        .replace(/^(\w)/g, (_, m) => m.toUpperCase()));
  }

  get outputFileBaseName() {
    return this._outputFileBaseName || (this._outputFileBaseName = `${this.kebabCaseName}.module`);
  }

  get moduleName() {
    return this._moduleName || (this._moduleName || `${this.pascalCaseName}Module`);
  }

  get importPath() {
    throw new Error('Not implemented!');
  }

  get rootImportPath() {
    return this._rootImportPath ||
      (this._rootImportPath = `./${[...this.modules, this.outputFileBaseName].join('/')}`);
  }

  async createModule(outputPath) {
    const content = await this._angularTemplate();
    await writeFileAsync(join(outputPath, ...this.modules, `${this.outputFileBaseName}.ts`), content, 'utf8');
  }

  _normaliseName() {
    throw new Error('Not implemented!');
  }

  async _angularTemplate() {
    throw new Error('Not implemented!');
  }
}

exports.IconModule = IconModule;
const { readFile, writeFile } = require('fs');
const { join } = require('path');
const readFileAsync = require('util').promisify(readFile);
const writeFileAsync = require('util').promisify(writeFile);

class IconModule {
  constructor(modules, kebabCaseName) {
    this.modules = modules;
    this.kebabCaseName = kebabCaseName
    this.pascalCaseName = this.kebabCaseName
      .replace(/-(\w)/g, (_, m) => m.toUpperCase())
      .replace(/^(\w)/g, (_, m) => m.toUpperCase());
    this.outputFileBaseName = `${this.kebabCaseName}.module`;
    this.moduleName = `${this.pascalCaseName}Module`;
    this.rootImportPath = `./${[...this.modules, this.outputFileBaseName].join('/')}`;
    this.importPath = undefined;
  }

  async createModule(outputPath) {
    const filePath = join(outputPath, ...this.modules, `${this.outputFileBaseName}.ts`);
    const content = await this._angularTemplate();
    const existingContent = await readFileAsync(filePath, 'utf8')
      .catch(() => { });
    if (this._isSameFileContent(existingContent || '', content)) {
      console.log(`Skipped ${this.modules.concat(this.outputFileBaseName).join('/')}`);
    } else {
      await writeFileAsync(filePath, content, 'utf8');
      console.log(`Created ${this.modules.concat(this.outputFileBaseName).join('/')}`);
    }
  }

  iconComponentDetails() {
    throw new Error('Not implemented!');
  }

  _normaliseName() {
    throw new Error('Not implemented!');
  }

  async _angularTemplate() {
    throw new Error('Not implemented!');
  }

  _isSameFileContent(fileContent, newFileContent) {
    return fileContent.replace(/[\r\n]+/g, ' ') === newFileContent.replace(/[\r\n]+/g, ' ');
  }
}

exports.IconModule = IconModule;
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export abstract class IconModule {
  readonly modules: string[];
  readonly kebabCaseName: string;
  readonly pascalCaseName: string;
  readonly outputFileBaseName: string;
  readonly moduleName: string;
  readonly rootImportPath: string;
  importPath: string;

  constructor(modules: string[], kebabCaseName: string) {
    this.modules = modules;
    this.kebabCaseName = kebabCaseName;
    this.pascalCaseName = this.kebabCaseName
      .replace(/-(\w)/g, (_, m) => m.toUpperCase())
      .replace(/^(\w)/g, (_, m) => m.toUpperCase());
    this.outputFileBaseName = `${this.kebabCaseName}.module`;
    this.moduleName = `${this.pascalCaseName}Module`;
    this.rootImportPath = `./${[...this.modules, this.outputFileBaseName].join('/')}`;
  }

  async createModule(outputPath: string) {
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

  abstract iconComponentDetails(): { selector: string, name: string, modules: string[] }[];
  protected abstract _angularTemplate(): Promise<string>;

  private _isSameFileContent(fileContent: string, newFileContent: string) {
    return fileContent.replace(/[\r\n]+/g, ' ') === newFileContent.replace(/[\r\n]+/g, ' ');
  }
}

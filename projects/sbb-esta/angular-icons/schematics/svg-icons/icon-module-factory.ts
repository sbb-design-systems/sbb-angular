import { dirname, join, Path } from '@angular-devkit/core';
import { FileEntry, SchematicsException, Tree } from '@angular-devkit/schematics';

import { Registry } from '../svg-registry/registry';

import { IconModule } from './icon-module';
import { createSvgOptimizer } from './svgo';

export class IconModuleFactory {
  private readonly _registry: Registry;
  private readonly _svgOptimizer = createSvgOptimizer();

  constructor(private readonly _tree: Tree, private readonly _registryFileEntry: FileEntry) {
    this._registry = JSON.parse(_registryFileEntry.content.toString('utf8'));
  }

  async createIconModules() {
    const root = dirname(this._registryFileEntry.path);
    const iconFactories = Object.keys(this._registry).map(async f => {
      const path = join(root, f);
      const svgContent = this._readSvgContent(path);
      const width = this._determineWidth(svgContent, path);
      const height = this._determineHeight(svgContent, path);
      return new IconModule(
        this._registry[f].normalizedName,
        this._registry[f].collections,
        await this._svgOptimizer(svgContent),
        `${width}px`,
        `${height}px`
      );
    });
    return Promise.all(iconFactories);
  }

  private _readSvgContent(path: Path) {
    const content = this._tree.read(path);
    if (!content) {
      throw new SchematicsException(`File ${path} from registry does not exist!`);
    }

    return content.toString('utf8');
  }

  private _determineWidth(content: string, filepath: Path) {
    return this._determineDimension(
      /( width="([^"]+)"| viewBox="\d+[ ,]+\d+[ ,]+(\d+)[ ,]+\d+")/g,
      'width',
      content,
      filepath
    );
  }

  private _determineHeight(content: string, filepath: Path) {
    return this._determineDimension(
      /( height="([^"]+)"| viewBox="\d+[ ,]+\d+[ ,]+\d+[ ,]+(\d+))"/g,
      'height',
      content,
      filepath
    );
  }

  private _determineDimension(regex: RegExp, type: string, content: string, filepath: Path) {
    const match = regex.exec(content);
    if (!match) {
      throw new SchematicsException(
        `No ${type} found in ${filepath} (Either as attribute or in viewBox)`
      );
    }

    const value = Number((match[2] || match[3]).replace('px', ''));
    if (isNaN(value)) {
      throw new SchematicsException(`Cannot parse ${match[2] || match[3]} to a number`);
    }

    return value;
  }
}

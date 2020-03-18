import { join, Path, strings } from '@angular-devkit/core';
import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';

import { IconModule } from './icon-module';
import { IconModuleCollection } from './icon-module-collection';

export class ApplicationIconModuleGenerator {
  protected readonly _projectRootDir: Path;
  protected readonly _targetDir: Path;
  protected readonly _prefix: string;

  constructor(
    protected readonly _rootCollection: IconModuleCollection,
    tree: Tree,
    project: WorkspaceProject,
    targetDir: string
  ) {
    this._projectRootDir = tree.getDir(project.root).path;
    this._targetDir = join(this._projectRootDir, targetDir);
    this._prefix = project.prefix || 'app';
  }

  generate(): Rule[] {
    return this._generateCollection(this._rootCollection, this._targetDir);
  }

  protected _generateCollection(collection: IconModuleCollection, targetDir: Path): Rule[] {
    return [
      this._generateIcons(collection.icons, targetDir),
      ...this._generateCollections(collection.collections, targetDir)
    ];
  }

  protected _generateIcons(icons: IconModule[], targetDir: Path): Rule {
    return chain(
      icons.map(i =>
        mergeWith(
          apply(url('./files/icon'), [
            template({
              ...strings,
              ...i,
              prefix: this._prefix,
              cssClasses: i.collections.map(c => `${this._prefix}-icon-${c}`).join(' '),
              template: this._extractTemplate(i),
              attributes: this._extractAttributes(i)
            }),
            move(targetDir)
          ])
        )
      )
    );
  }

  protected _generateCollections(
    collections: Map<string, IconModuleCollection>,
    targetDir: Path
  ): Rule[] {
    return Array.from(collections)
      .map(([path, c]) => this._generateCollection(c, join(targetDir, path)))
      .reduce((current, next) => current.concat(next), [] as Rule[]);
  }

  private _extractTemplate(icon: IconModule) {
    const regex = /^<svg[^>]*>([\w\W]+)<\/svg>/m;
    const match = icon.svgContent.match(regex);
    if (!match || !match[1]) {
      throw new SchematicsException(`Parsing ${icon.normalizedName} with ${regex} failed`);
    }

    return match[1];
  }

  private _extractAttributes(icon: IconModule): { key: string; value: string }[] {
    const regex = /^<svg([^>]*)>/m;
    const match = icon.svgContent.match(regex);
    if (!match || !match[1]) {
      throw new SchematicsException(`Parsing ${icon.normalizedName} with ${regex} failed`);
    }

    const attributesMatch = match[1].trim().match(/(\w+)=["']([^"]+)["']/g);
    if (!attributesMatch) {
      return [];
    }

    return attributesMatch.map(m => {
      const index = m.indexOf('=');
      return {
        key: m.substring(0, index),
        value: m.substring(index + 2, m.length - 1)
      };
    });
  }
}

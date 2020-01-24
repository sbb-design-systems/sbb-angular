import { join, Path, relative, strings } from '@angular-devkit/core';
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

export class LibraryIconModuleGenerator {
  private readonly _projectRootDir: Path;
  private readonly _targetDir: Path;
  private readonly _prefix: string;
  private readonly _packageName: string;

  constructor(
    private readonly _rootCollection: IconModuleCollection,
    tree: Tree,
    project: WorkspaceProject,
    targetDir: string
  ) {
    this._projectRootDir = tree.getDir(project.root).path;
    this._targetDir = join(this._projectRootDir, targetDir);
    this._prefix = project.prefix || 'app';
    const packageJson = tree.read(join(this._projectRootDir, 'package.json'));
    if (!packageJson) {
      throw new SchematicsException(`Expected package.json in ${this._projectRootDir}`);
    }

    this._packageName = JSON.parse(packageJson.toString('utf8')).name;
  }

  generate(): Rule[] {
    return this._generateCollection(this._rootCollection, this._targetDir).concat(
      mergeWith(
        apply(url('./files/meta'), [
          template({
            ...strings,
            prefix: this._prefix,
            icons: this._recursiveIcons(this._rootCollection),
            packageName: this._packageName,
            path: relative(this._projectRootDir, this._targetDir)
          }),
          move(this._targetDir)
        ])
      )
    );
  }

  private _generateCollection(collection: IconModuleCollection, targetDir: Path): Rule[] {
    return [
      chain([
        mergeWith(
          apply(url('./files/icon-entrypoint'), [
            template({
              ...collection,
              packageName: this._packageName,
              path: relative(this._projectRootDir, targetDir)
            }),
            move(targetDir)
          ])
        ),
        this._generateIcons(collection.icons, join(targetDir, 'src'))
      ]),
      ...this._generateCollections(collection.collections, targetDir)
    ];
  }

  private _generateIcons(icons: IconModule[], targetDir: Path): Rule {
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

  private _generateCollections(
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

  private _recursiveIcons(collection: IconModuleCollection): IconModule[] {
    return [
      ...collection.icons,
      ...Array.from(collection.collections)
        .map(([_, c]) => this._recursiveIcons(c))
        .reduce((current, next) => current.concat(next), [] as IconModule[])
    ];
  }
}

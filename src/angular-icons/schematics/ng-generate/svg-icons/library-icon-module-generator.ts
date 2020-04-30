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
import { rename } from '@angular-devkit/schematics/src/rules/rename';

import { ApplicationIconModuleGenerator } from './application-icon-module-generator';
import { IconModule } from './icon-module';
import { IconModuleCollection } from './icon-module-collection';

export class LibraryIconModuleGenerator extends ApplicationIconModuleGenerator {
  private readonly _packageName: string;

  constructor(
    rootCollection: IconModuleCollection,
    tree: Tree,
    project: WorkspaceProject,
    targetDir: string
  ) {
    super(rootCollection, tree, project, targetDir);
    const packageJson = tree.read(join(this._projectRootDir, 'package.json'));
    if (!packageJson) {
      throw new SchematicsException(`Expected package.json in ${this._projectRootDir}`);
    }

    this._packageName = JSON.parse(packageJson.toString('utf8')).name;
  }

  generate(): Rule[] {
    return super.generate().concat(
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
      ),
      rename(
        path => path.endsWith('schematics-package.json'),
        path => path.replace('schematics-package.json', 'package.json')
      )
    );
  }

  protected _generateCollection(collection: IconModuleCollection, targetDir: Path): Rule[] {
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

  private _recursiveIcons(collection: IconModuleCollection): IconModule[] {
    return [
      ...collection.icons,
      ...Array.from(collection.collections)
        .map(([_, c]) => this._recursiveIcons(c))
        .reduce((current, next) => current.concat(next), [] as IconModule[])
    ];
  }
}

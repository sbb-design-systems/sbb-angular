import { DirEntry, Tree } from '@angular-devkit/schematics';

import { BazelSchematicContext } from './bazel-schematic-context';
import { NgPackage } from './ng-package';

export class NgPackageExamples extends NgPackage {
  protected _templateUrl = './files/ngPackageExamples';

  constructor(dir: DirEntry, tree: Tree, context: BazelSchematicContext) {
    super(dir, tree, context);
    this.shortName = this.name.replace('components-', '');
  }

  protected _templateOptions(): any {
    return {
      ...super._templateOptions(),
      exampleModules: this.ngModules().filter((ngModule) => ngModule !== this),
    };
  }
}

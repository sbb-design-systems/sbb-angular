import { basename, fragment } from '@angular-devkit/core';
import { DirEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ShowcaseModule } from './showcase-module';

export class ShowcasePackage {
  private _appModule: ShowcaseModule;
  private _appDir: DirEntry;

  constructor(private _dir: DirEntry, private _tree: Tree, context: SchematicContext) {
    this._appDir = this._dir.dir(fragment('app'));
    this._appModule = new ShowcaseModule(this._appDir, this._tree, context);
  }

  render(): Rule[] {
    const exampleModules = this._appDir.subdirs
      .map((d) => {
        const dir = this._appDir.dir(d);
        const examplesDirName = fragment(`${basename(dir.path)}-examples`);
        if (!dir.subdirs.includes(examplesDirName)) {
          return [];
        }
        const examplesDir = dir.dir(examplesDirName);
        return examplesDir.subdirs.map((e) => `    "/${examplesDir.dir(e).path}",`);
      })
      .reduce((current, next) => current.concat(next))
      .sort()
      .join('\n');
    const buildFile = this._dir.file(fragment('BUILD.bazel'))!;
    this._tree.overwrite(
      buildFile.path,
      buildFile.content
        .toString()
        .replace(/ALL_EXAMPLES = \[[^\]]+\]/m, `ALL_EXAMPLES = [\n${exampleModules}\n]`)
    );
    return this._appModule.render();
  }
}

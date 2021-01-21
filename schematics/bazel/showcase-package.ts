import { basename, fragment } from '@angular-devkit/core';
import { DirEntry, Rule, Tree } from '@angular-devkit/schematics';

import { BazelSchematicContext } from './bazel-schematic-context';
import { ShowcaseModule } from './showcase-module';

export class ShowcasePackage {
  protected _appModule: ShowcaseModule;
  protected _appDir: DirEntry;

  constructor(protected _dir: DirEntry, protected _tree: Tree, context: BazelSchematicContext) {
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
      .reduce((current, next) => current.concat(next), [] as string[])
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

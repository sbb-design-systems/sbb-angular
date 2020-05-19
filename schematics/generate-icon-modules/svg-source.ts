import { DirEntry, SchematicsException } from '@angular-devkit/schematics';

import { IconCollectionModule } from './icon-collection-module';
import { IconModule } from './icon-module';
import namingRules from './naming-rules';
import { SvgFile } from './svg-file';

export class SvgSource {
  constructor(private _files: SvgFile[]) {}

  static async from(svgDirectory: DirEntry) {
    const files: Promise<SvgFile>[] = [];
    svgDirectory.visit((path, entry) => {
      if (entry && path.endsWith('.svg')) {
        files.push(SvgFile.from(path, entry));
      }
    });
    const resolvedFiles = (await Promise.all(files)).map((f) =>
      namingRules.reduce((current, next) => next(current), f)
    );
    return new SvgSource(resolvedFiles);
  }

  assertNoDuplicates() {
    const duplicates = this._files
      .map((file, i, a) =>
        i === a.findIndex((f) => f.name === file.name && f.size === file.size)
          ? a.filter((f) => f.name === file.name && f.size === file.size)
          : []
      )
      .filter((f) => f.length > 1);
    if (duplicates.length) {
      const duplicateOutput = duplicates
        .map((d) => d.map((f) => `  ${f.name}: ${f.filepath}`).join('\n'))
        .join('\n');
      throw new SchematicsException(`\nDuplicates found:\n${duplicateOutput}`);
    }

    return this;
  }

  toCollectionModules() {
    const iconModules = this._toIconModules();
    const moduleTrees = iconModules
      .map((i) => i.modules)
      .filter((v, i, a) => i === a.findIndex((vi) => vi.join(',') === v.join(',')));
    const collectionMap = new Map<string, IconCollectionModule>();
    const rootCollection = new IconCollectionModule();
    for (const moduleTree of moduleTrees) {
      let collection = rootCollection;
      for (const moduleName of moduleTree) {
        let localCollection = collection.collections.find((c) => c.name === moduleName);
        if (!localCollection) {
          localCollection = new IconCollectionModule(moduleName);
          collectionMap.set(moduleTree.join(','), localCollection);
          collection.collections.push(localCollection);
        }

        collection = localCollection;
      }
    }
    iconModules.forEach((i) =>
      // tslint:disable-next-line:no-non-null-assertion
      collectionMap.get(i.modules.join(','))!.icons.push(i)
    );
    return rootCollection;
  }

  private _toIconModules() {
    const svgMap = this._files.reduce(
      (current, next) => current.set(next.name, [...(current.get(next.name) || []), next]),
      new Map<string, SvgFile[]>()
    );
    return Array.from(svgMap.values()).map((g) => new IconModule(g));
  }
}

import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';

import { SvgSource } from './svg-source';

export function generateIconModules(options: { dist: string }): Rule {
  return async (tree: Tree): Promise<Rule> => {
    const collection = (await SvgSource.from(tree.getDir('svg')))
      .assertNoDuplicates()
      .toCollectionModules();
    const dist = tree.getDir(options.dist);
    const icons = collection.iconsRecursive;

    return chain([
      mergeWith(
        apply(url('./files/root'), [
          template({
            ...strings,
            icons
          }),
          move(dist.path)
        ])
      ),
      collection.apply(dist)
    ]);
  };
}

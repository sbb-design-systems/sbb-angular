import { strings } from '@angular-devkit/core';
import {
  apply,
  callRule,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SvgSource } from './svg-source';

export function generateIconModules(options: { dist: string }): Rule {
  return (tree: Tree, context: SchematicContext): Observable<Tree> =>
    from<Rule>(
      (async () => {
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
      })()
    ).pipe(switchMap(rule => callRule(rule, of(tree), context)));
}

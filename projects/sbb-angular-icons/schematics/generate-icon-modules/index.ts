import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  template,
  move,
  mergeWith,
  chain,
  callRule
} from '@angular-devkit/schematics';
import { SvgSource } from './svg-source';
import { strings } from '@angular-devkit/core';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function generateIconModules(_options: { dist: string }): Rule {
  return (tree: Tree, _context: SchematicContext): Observable<Tree> =>
    from<Rule>(
      (async () => {
        const collection = (await SvgSource.from(tree.getDir('svg')))
          .assertNoDuplicates()
          .toCollectionModules();
        const dist = tree.getDir(_options.dist);
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
    ).pipe(switchMap(rule => callRule(rule, of(tree), _context)));
}

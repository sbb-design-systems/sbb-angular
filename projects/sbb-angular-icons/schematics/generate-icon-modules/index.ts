import { Rule, SchematicContext, Tree, url, apply, template, move, mergeWith, chain, callRule } from '@angular-devkit/schematics';
import { SvgSource } from './svg-source';
import { strings } from '@angular-devkit/core';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function generateIconModules(_options: { dist: string }): Rule {
  return (tree: Tree, _context: SchematicContext): Observable<Tree> =>
    from<Rule>((async () => {
      const collection = (await SvgSource.from(tree.getDir('svg')))
        .assertNoDuplicates()
        .toCollectionModules();
      const dist = tree.getDir(_options.dist);
      const icons = collection.iconsRecursive;

      return chain([
        mergeWith(
          apply(
            url('./files/root'), [
              template({
                ...strings,
                icons,
              }),
              move(dist.path)
            ])),
        collection.apply(dist),
      ]);
    })())
      .pipe(switchMap(rule => callRule(rule, of(tree), _context)));
}

/*

  return (tree: Tree, _context: SchematicContext): Observable<Tree> => combineLatest(
    of(
      mergeWith(
        apply(
          url('./files/root'), [
            template({
              ...strings,
            }),
            move(tree.getDir(_options.dist).path)
          ]))),
    from(SvgSource.from(tree.getDir('svg')))
      .pipe(
        map(s => s
          .assertNoDuplicates()
          .toCollectionModules()
          .apply(tree.getDir(_options.dist)))),
    (...rules) => chain(rules))
    .pipe(switchMap(rule => callRule(rule, of(tree), _context)));
*/

/*
return combineLatest(
  of(dist)
    .pipe(map(d => {
      const rootTemplate = url('./files/root');
      const parametrizedRootTemplate = apply(rootTemplate, [
        template({
          ...strings,
        }),
        move(d.path)
      ]);
      return mergeWith(parametrizedRootTemplate);
    })),
  from(SvgSource.from(tree.getDir('svg')))
    .pipe(
      map(s => s
        .assertNoDuplicates()
        .toCollectionModules()
        .apply(dist))),
  (rules) => chain(rules)
)
.pipe(map(() => tree));
*/

/*
 from(async () => {
    const collection = (await SvgSource.from(tree.getDir('svg')))
      .assertNoDuplicates()
      .toCollectionModules();
    const dist = tree.getDir(_options.dist);
    const rootTemplate = url('./files/root');
    const parametrizedRootTemplate = apply(rootTemplate, [
      template({
        ...strings,
      }),
      move(dist.path)
    ]);

    chain([
      mergeWith(parametrizedRootTemplate),
      collection.apply(dist),
    ])(tree, _context);
  }).pipe(map(() => tree));
*/
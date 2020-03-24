import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { NgPackage } from './ng-package';
import { ShowcasePackage } from './showcase-package';

export function bazel(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const srcDir = tree.getDir('src');
    return chain(
      srcDir.subdirs
        .map(d => srcDir.dir(d))
        .map(packageDir =>
          packageDir.path.endsWith('showcase')
            ? new ShowcasePackage(packageDir, tree, context)
            : new NgPackage(packageDir, tree, context)
        )
        .reduce((current, next) => current.concat(next.render()), [] as Rule[])
    );
  };
}

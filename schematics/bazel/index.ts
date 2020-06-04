import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { NgPackage } from './ng-package';
import { ShowcasePackage } from './showcase-package';

export function bazel(options: { filter?: string }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!isRunViaBuildBazelYarnCommand()) {
      throw new SchematicsException(`Please run this schematic via 'yarn generate:bazel'`);
    }

    const srcDir = tree.getDir('src');
    if (!options.filter) {
      srcDir.subdirs.forEach((d) => context.addTask(new RunSchematicTask('bazel', { filter: d })));
    } else {
      return chain(
        srcDir.subdirs
          .filter((d) => !options.filter || d === options.filter)
          .map((d) => srcDir.dir(d))
          .map((packageDir) =>
            packageDir.path.endsWith('showcase')
              ? new ShowcasePackage(packageDir, tree, context)
              : new NgPackage(packageDir, tree, context)
          )
          .reduce((current, next) => current.concat(next.render()), [] as Rule[])
      );
    }

    function isRunViaBuildBazelYarnCommand() {
      return (
        process.env.npm_config_user_agent &&
        process.env.npm_config_user_agent.startsWith('yarn') &&
        process.env.npm_lifecycle_event &&
        process.env.npm_lifecycle_event === 'build:bazel'
      );
    }
  };
}

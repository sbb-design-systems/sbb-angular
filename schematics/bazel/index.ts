import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { BazelGenruleResolver } from './bazel-genrule-resolver';
import { AppBazelModuleDetector, LibraryBazelModuleDetector } from './bazel-module-detector';
import { NgPackage } from './ng-package';
import { NpmDependencyResolver } from './npm-dependency-resolver';
import { FlexibleSassDependencyResolver } from './sass-dependency-resolver';
import { ShowcasePackage } from './showcase-package';
import {
  RelativeModuleTypeScriptDependencyResolver,
  StrictModuleTypeScriptDependencyResolver,
} from './typescript-dependency-resolver';

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
          .map((packageDir) => {
            const isShowcase = packageDir.path.endsWith('showcase');
            const organization = '@sbb-esta';
            const srcRoot = 'src';
            const moduleDetector = isShowcase
              ? new AppBazelModuleDetector(tree)
              : new LibraryBazelModuleDetector(tree);
            const npmDependencyResolver = new NpmDependencyResolver(
              tree.read('package.json')!.toString()
            );
            const dependencyByOccurence = new Map<string, string>().set(
              'ngDevMode',
              '//src:dev_mode_types'
            );
            const tsConfig = {
              organization,
              srcRoot,
              tree,
              moduleDetector,
              npmDependencyResolver,
              dependencyByOccurence,
            };
            const typeScriptDependencyResolver = isShowcase
              ? new RelativeModuleTypeScriptDependencyResolver(tsConfig)
              : new StrictModuleTypeScriptDependencyResolver(tsConfig);
            const sassDependencyResolver = new FlexibleSassDependencyResolver(
              moduleDetector,
              npmDependencyResolver,
              context.logger,
              new Map<string, string>()
                .set('/angular-core/styles/common', '//src/angular-core/styles:common_scss_lib')
                .set(
                  'external/npm/node_modules/@angular/cdk/a11y',
                  '//src/angular-core/styles:common_scss_lib'
                )
            );
            const bazelGenruleResolver = new BazelGenruleResolver();
            return isShowcase
              ? new ShowcasePackage(packageDir, tree, {
                  ...context,
                  organization,
                  srcRoot,
                  moduleDetector,
                  typeScriptDependencyResolver,
                  sassDependencyResolver,
                  bazelGenruleResolver,
                })
              : new NgPackage(packageDir, tree, {
                  ...context,
                  organization,
                  srcRoot,
                  moduleDetector,
                  typeScriptDependencyResolver,
                  sassDependencyResolver,
                  bazelGenruleResolver,
                });
          })
          .reduce((current, next) => current.concat(next.render()), [] as Rule[])
      );
    }

    function isRunViaBuildBazelYarnCommand() {
      return (
        process.env.npm_config_user_agent &&
        process.env.npm_config_user_agent.startsWith('yarn') &&
        process.env.npm_lifecycle_event &&
        process.env.npm_lifecycle_event === 'generate:bazel'
      );
    }
  };
}

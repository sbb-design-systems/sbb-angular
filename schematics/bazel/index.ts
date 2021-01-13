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
import { NgPackageExamples } from './ng-package-examples';
import { NpmDependencyResolver } from './npm-dependency-resolver';
import { FlexibleSassDependencyResolver } from './sass-dependency-resolver';
import { ShowcasePackage } from './showcase-package';
import {
  RelativeModuleTypeScriptDependencyResolver,
  StrictModuleTypeScriptDependencyResolver,
} from './typescript-dependency-resolver';

declare const v8debug: any;

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
            const isShowcase = packageDir.path.includes('showcase');
            const isAngular = packageDir.path.endsWith('angular');
            const isComponentsExamples = packageDir.path.endsWith('components-examples');
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
            if (isShowcase) {
              return new ShowcasePackage(packageDir, tree, {
                ...context,
                organization,
                srcRoot,
                moduleDetector,
                typeScriptDependencyResolver,
                sassDependencyResolver,
                bazelGenruleResolver,
              });
            } else if (isAngular) {
              return new NgPackage(packageDir, tree, {
                ...context,
                organization,
                srcRoot,
                moduleDetector,
                typeScriptDependencyResolver,
                sassDependencyResolver: new FlexibleSassDependencyResolver(
                  moduleDetector,
                  npmDependencyResolver,
                  context.logger,
                  new Map<string, string>()
                    .set('/angular/styles/common', '//src/angular/styles:common_scss_lib')
                    .set(
                      'external/npm/node_modules/@angular/cdk/a11y',
                      '//src/angular/styles:common_scss_lib'
                    )
                ),
                bazelGenruleResolver,
              });
            } else if (isComponentsExamples) {
              return new NgPackageExamples(packageDir, tree, {
                ...context,
                organization,
                srcRoot,
                moduleDetector,
                typeScriptDependencyResolver,
                sassDependencyResolver: new FlexibleSassDependencyResolver(
                  moduleDetector,
                  npmDependencyResolver,
                  context.logger,
                  new Map<string, string>()
                    .set('/angular/styles/common', '//src/angular/styles:common_scss_lib')
                    .set(
                      'external/npm/node_modules/@angular/cdk/a11y',
                      '//src/angular/styles:common_scss_lib'
                    )
                ),
                bazelGenruleResolver,
              });
            } else {
              return new NgPackage(packageDir, tree, {
                ...context,
                organization,
                srcRoot,
                moduleDetector,
                typeScriptDependencyResolver,
                sassDependencyResolver,
                bazelGenruleResolver,
              });
            }
          })
          .reduce((current, next) => current.concat(next.render()), [] as Rule[])
      );
    }

    function isRunViaBuildBazelYarnCommand() {
      return (
        typeof v8debug === 'object' ||
        /--debug|--inspect/.test(process.execArgv.join(' ')) ||
        process.env.debugmode ||
        (process.env.npm_config_user_agent &&
          process.env.npm_config_user_agent.startsWith('yarn') &&
          process.env.npm_lifecycle_event &&
          process.env.npm_lifecycle_event === 'generate:bazel')
      );
    }
  };
}

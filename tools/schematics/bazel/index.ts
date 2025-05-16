import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';

import { BazelGenruleResolver } from './bazel-genrule-resolver';
import { LibraryBazelModuleDetector } from './bazel-module-detector';
import { NgPackage } from './ng-package';
import { NgPackageExamples } from './ng-package-examples';
import { NpmDependencyResolver } from './npm-dependency-resolver';
import { FlexibleSassDependencyResolver } from './sass-dependency-resolver';
import { StrictModuleTypeScriptDependencyResolver } from './typescript-dependency-resolver';

declare const v8debug: any;

export function bazel(options: { filter?: string }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const srcDir = tree.getDir('src');
    if (!options.filter) {
      srcDir.subdirs.forEach((d) => context.addTask(new RunSchematicTask('bazel', { filter: d })));
    } else {
      return chain(
        srcDir.subdirs
          .filter((d) => !options.filter || d === options.filter)
          .map((d) => srcDir.dir(d))
          .map((packageDir) => {
            const isComponentsExamples = packageDir.path.endsWith('components-examples');
            const organization = '@sbb-esta';
            const srcRoot = 'src';
            const moduleDetector = new LibraryBazelModuleDetector(tree);
            const npmDependencyResolver = new NpmDependencyResolver(
              tree.read('package.json')!.toString(),
            );
            const dependencyByOccurence = new Map<string, string>()
              .set('ngDevMode', '//src:dev_mode_types')
              .set('typeof global', '//:node_modules/@types/node');
            const tsConfig = {
              organization,
              srcRoot,
              tree,
              moduleDetector,
              npmDependencyResolver,
              dependencyByOccurence,
            };
            const typeScriptDependencyResolver = new StrictModuleTypeScriptDependencyResolver(
              tsConfig,
            );
            const styleReplaceMap = new Map<string, string>()
              .set('@sbb-esta/angular', '//src/angular:scss_lib')
              .set('external/npm/node_modules/@angular/cdk', '//src/angular:scss_lib');
            const sassDependencyResolver = new FlexibleSassDependencyResolver(
              moduleDetector,
              npmDependencyResolver,
              context.logger,
              styleReplaceMap,
            );
            const bazelGenruleResolver = new BazelGenruleResolver();
            if (isComponentsExamples) {
              return new NgPackageExamples(packageDir, tree, {
                ...context,
                organization,
                srcRoot,
                moduleDetector,
                typeScriptDependencyResolver,
                sassDependencyResolver,
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
          .reduce((current, next) => current.concat(next.render()), [] as Rule[]),
      );
    }
  };
}

import { SchematicContext } from '@angular-devkit/schematics';

import { BazelGenruleResolver } from './bazel-genrule-resolver';
import { BazelModuleDetector } from './bazel-module-detector';
import { SassDependencyResolver } from './sass-dependency-resolver';
import { TypeScriptDependencyResolver } from './typescript-dependency-resolver';

export interface BazelSchematicContext extends SchematicContext {
  organization: string;
  srcRoot: string;
  moduleDetector: BazelModuleDetector;
  typeScriptDependencyResolver: TypeScriptDependencyResolver;
  sassDependencyResolver: SassDependencyResolver;
  bazelGenruleResolver: BazelGenruleResolver;
}

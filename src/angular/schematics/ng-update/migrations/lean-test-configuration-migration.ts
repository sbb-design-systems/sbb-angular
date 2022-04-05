import { JsonValue } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { chain, noop, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getProjectTargetOptions } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import { TEST_TS_LEAN_CONFIG } from '../../ng-add/setup-project';

export function leanTestConfigurationMigration(): Rule {
  return async (host: Tree, _context: SchematicContext): Promise<Rule> => {
    const workspace = await getWorkspace(host);
    const projects = Array.from(workspace.projects.values()).filter(
      (project) => project.extensions.projectType === ProjectType.Application
    );
    if (!projects.length) {
      return noop();
    }

    return chain(projects.map((project) => updateTestTs(project)));
  };
}

function isLeanProject(targetOptions: Record<string, JsonValue | undefined>, tree: Tree) {
  if (!targetOptions?.index) {
    return false;
  }

  const indexHtml = tree.read(targetOptions.index as string)?.toString('utf-8');
  if (!indexHtml) {
    return false;
  }

  const htmlTag = indexHtml.match(
    /<html(?=\s)(?!(?:[^>"\']|"[^"]*"|\'[^\']*\')*?(?<=\s)(?:term|range)\s*=)(?!\s*\/?>)\s+(?:".*?"|\'.*?\'|[^>]*?)+>/g
  )?.[0];
  if (!htmlTag) {
    return false;
  }

  const classTag = htmlTag.match(/class=(["'])?((?:.(?!\1|>))*.?)\1?/g)?.[0];
  if (!classTag) {
    return false;
  }

  const classList = classTag.replace(/["']/g, '').replace('class=', '').split(' ');
  return classList?.includes('sbb-lean');
}

function updateTestTs(project: ProjectDefinition): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const targetOptions = getProjectTargetOptions(project, 'build');

    if (!isLeanProject(targetOptions, tree)) {
      return;
    }

    const testOptions = getProjectTargetOptions(project, 'test');

    if (!testOptions?.main) {
      context.logger.warn(
        `Could not configure testing environment to sbb-lean. No main entry (test.ts) in angular.json found.`
      );
      return;
    }

    const testTs = tree.read(testOptions.main as string)?.toString('utf-8');

    if (!testTs) {
      context.logger.warn(
        `Could not read ${testOptions.main} file to configure lean design for tests.`
      );
      return;
    }

    const hasLean = testTs.includes('sbb-lean');
    if (hasLean) {
      return;
    }

    tree.overwrite(testOptions.main as string, testTs + TEST_TS_LEAN_CONFIG + '\n');

    context.logger.info(
      `✔️ Configured testing environment (${testOptions.main}) with lean design variant.`
    );
  };
}

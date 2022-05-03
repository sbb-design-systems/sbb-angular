import { extname, JsonValue } from '@angular-devkit/core';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  DevkitContext,
  getProjectFromWorkspace,
  getProjectTargetOptions,
  Migration,
  ResolvedResource,
  TargetVersion,
} from '@angular/cdk/schematics';
import { updateWorkspace } from '@schematics/angular/utility/workspace';

import { getProjectName } from '../../utils';
import { Schema } from '../schema';

export class StyleImportMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  override visitStylesheet(stylesheet: ResolvedResource): void {
    const extension = extname(stylesheet.filePath);

    if (extension === '.scss' || extension === '.css') {
      const content = stylesheet.content;
      const migratedContent = content
        .replace(/@(?:import|use) +['"](~@sbb-esta\/.*)['"].*;?/g, (match, importPath) => {
          const index = match.indexOf(importPath);
          const newImportPath = importPath.replace(/^~|\.scss$/g, '');
          return match.slice(0, index) + newImportPath + match.slice(index + importPath.length);
        })
        .replace(
          /@sbb-esta\/angular-(core|business|public)\/_?styles(.scss)?[^'"]*/g,
          '@sbb-esta/angular/styles'
        )
        .replace(
          /@sbb-esta\/angular-(business|public)\/typography.css/g,
          '@sbb-esta/angular/typography.css'
        );

      if (migratedContent && migratedContent !== content) {
        this.fileSystem
          .edit(stylesheet.filePath)
          .remove(0, stylesheet.content.length)
          .insertLeft(0, migratedContent);
      }
    }
  }
}

export function migrateTypographyInAngularJson(options: Schema): Rule {
  return chain([
    migrateTypographyInAngularJsonPerTarget(options, 'build'),
    migrateTypographyInAngularJsonPerTarget(options, 'test'),
  ]);
}

function migrateTypographyInAngularJsonPerTarget(
  options: Schema,
  targetName: 'build' | 'test'
): Rule {
  return async (host: Tree, context: SchematicContext) => {
    return updateWorkspace((workspace) => {
      const project = getProjectFromWorkspace(workspace, getProjectName(options, workspace));

      let targetOptions: Record<string, JsonValue | undefined>;
      try {
        targetOptions = getProjectTargetOptions(project, targetName);
      } catch (e) {
        context.logger.warn(
          `Skipped typography migration for ${targetName} configuration due to missing file.`
        );
        return;
      }
      const styles = targetOptions.styles as (string | { input: string })[];

      if (styles) {
        targetOptions.styles = styles.map((path) => {
          function replace(pathToReplace: string) {
            return pathToReplace.replace(/angular-(public|business)\//g, 'angular/');
          }

          if (typeof path === 'string') {
            return replace(path);
          } else {
            path.input = replace(path.input);
            return path;
          }
        });
      }
    });
  };
}

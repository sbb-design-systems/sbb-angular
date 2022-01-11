import { extname } from '@angular-devkit/core';
import { chain, Rule } from '@angular-devkit/schematics';
import {
  DevkitContext,
  getProjectFromWorkspace,
  getProjectTargetOptions,
  Migration,
  ResolvedResource,
  TargetVersion,
} from '@angular/cdk/schematics';
import { updateWorkspace } from '@schematics/angular/utility/workspace';

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
  return updateWorkspace((workspace) => {
    const project = getProjectFromWorkspace(workspace, options.project);

    const targetOptions = getProjectTargetOptions(project, targetName);
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
}

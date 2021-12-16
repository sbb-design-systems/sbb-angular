import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getProjectFromWorkspace, getProjectMainFile } from '@angular/cdk/schematics';
import { getWorkspace, updateWorkspace } from '@schematics/angular/utility/workspace';

import { Schema } from '../schema';

export function migrateI18n(options: Schema): Rule {
  return chain([migrateAngularJson(options), migrateMainTs(options)]);
}

function migrateAngularJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return updateWorkspace((workspace) => {
      const project = getProjectFromWorkspace(workspace, options.project) as ProjectDefinition;
      const extensions = project.extensions as {
        i18n?: { locales?: Record<string, { translation?: string | string[] }> | string };
      };
      const i18n = extensions.i18n;

      if (!i18n) {
        return;
      }
      context.logger.warn(
        `Your application is using i18n. Please run 'ng extract-i18n' and check the @sbb-esta/angular related translations.`
      );
      context.logger.warn(
        `Please note that the key 'sbbGhettoboxCloseGhettobox' was renamed into 'sbbAlertCloseAlert'.`
      );
      context.logger.warn(
        `Also check https://angular.app.sbb.ch/angular/introduction/i18n if you like to use our provided translations.`
      );

      const locales = i18n.locales;

      if (!locales) {
        return;
      }

      const replace = (value) => value.replace('@sbb-esta/angular-core', '@sbb-esta/angular');

      const migrateGhettoboxKey = (file: string) => {
        if (!tree.exists(file)) {
          return;
        }
        let content = tree.read(file)!.toString('utf8');
        content = content.replace('sbbGhettoboxCloseGhettobox', 'sbbAlertCloseAlert');
        tree.overwrite(file, content);
      };

      const replaceOrMigrate = (value) => {
        if (!value.includes('@sbb-esta/angular-core')) {
          migrateGhettoboxKey(value);
        }
        return replace(value);
      };

      Object.keys(locales).forEach((key) => {
        const language = locales[key];
        const translation = language.translation;
        if (translation) {
          if (typeof translation === 'string') {
            if (!translation.includes('@sbb-esta/angular-core')) {
              migrateGhettoboxKey(translation);
            } else {
              language.translation = replace(translation);
            }
          } else if (Array.isArray(translation)) {
            language.translation = translation.map(replaceOrMigrate);
          }
        } else if (typeof language === 'string') {
          if (!language.includes('@sbb-esta/angular-core')) {
            migrateGhettoboxKey(language);
          } else {
            locales[key] = replace(language);
          }
        } else if (Array.isArray(language)) {
          locales[key] = language.map(replaceOrMigrate);
        }
      });
    });
  };
}

function migrateMainTs(options: Schema): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const mainTsPath = getProjectMainFile(project);
    if (tree.exists(mainTsPath)) {
      const mainTsContent = tree.read(mainTsPath)!.toString('utf8');
      tree.overwrite(
        mainTsPath,
        mainTsContent.replace('@sbb-esta/angular-core/i18n', '@sbb-esta/angular/i18n')
      );
    }
  };
}

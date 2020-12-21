import { basename, dirname, NormalizedRoot, Path } from '@angular-devkit/core';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  cdkMigrations,
  createMigrationSchematicRule,
  getProjectMainFile,
  TargetVersion,
} from '@angular/cdk/schematics';
import { DevkitFileSystem } from '@angular/cdk/schematics/ng-update/devkit-file-system';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';

import { addIconCdnProvider } from '../ng-add';

import { ClassNamesMigration } from './migrations/class-names';
import { FormFieldMigration } from './migrations/form-field-migration';
import { IconMigration } from './migrations/icon-migration';
import { UsermenuMigration } from './migrations/usermenu-migration';
import { sbbAngularUpgradeData } from './upgrade-data';

/** Entry point for the migration schematics with target of sbb-angular 10.0.0 */
export function updateToV10(): Rule {
  return createMigrationSchematicRule(
    TargetVersion.V10,
    [],
    sbbAngularUpgradeData,
    onMigrationComplete
  );
}

/** Entry point for adding the icon cdn registry to the app module. */
export function addIconCdnRegistry(): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const projects = Array.from(workspace.projects.keys()).filter((p) => {
      const project = workspace.projects.get(p)!;
      try {
        return (
          project.extensions.projectType === ProjectType.Application &&
          !!getProjectMainFile(project)
        );
      } catch {
        return false;
      }
    });

    return chain(projects.map((project) => addIconCdnProvider({ project })));
  };
}

/** Entry point for the migration schematics with target of sbb-angular 11.0.0 */
export function updateToV11(): Rule {
  patchClassNamesMigration();
  patchDevkitFileSystem();
  return createMigrationSchematicRule(
    TargetVersion.V11,
    [IconMigration, FormFieldMigration, UsermenuMigration],
    sbbAngularUpgradeData,
    onMigrationComplete
  );
}

function patchClassNamesMigration() {
  const indexOfClassNamesMigration = cdkMigrations.findIndex(
    (m) => m.name === 'ClassNamesMigration'
  );
  cdkMigrations[indexOfClassNamesMigration] = ClassNamesMigration;
}

function patchDevkitFileSystem() {
  const proto = DevkitFileSystem.prototype as any;

  if (proto._isExistingDirectory) {
    return;
  }

  proto.exists = function (fileOrDirPath: Path) {
    if (this._tree.exists(fileOrDirPath)) {
      return true;
    } else if (fileOrDirPath === NormalizedRoot) {
      return true;
    }

    const parent = dirname(fileOrDirPath);
    const dirName = basename(fileOrDirPath);
    if (this._tree.exists(parent)) {
      return false;
    }

    const dir = this._tree.getDir(parent);
    return dir.subdirs.indexOf(dirName) !== -1;
  };
}

/** Function that will be called when the migration completed. */
function onMigrationComplete(
  context: SchematicContext,
  targetVersion: TargetVersion,
  hasFailures: boolean
) {
  context.logger.info('');
  context.logger.info(`  ✓  Updated @sbb-esta/angular-core to ${targetVersion}`);
  context.logger.info('');

  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}

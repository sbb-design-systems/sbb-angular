import { dirname } from '@angular-devkit/core';
import { addModuleImportToModule, ResolvedResource } from '@angular/cdk/schematics';
import { findModule } from '@schematics/angular/utility/find-module';
import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that migrates the tabs usages.
 */
export class TabsMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-tab usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-tab');
  }

  protected _migrate(element: MigrationElement) {
    const labelId = element.findProperty('labelId');
    labelId?.remove();

    const badgePill = element.findProperty('badgePill');
    if (badgePill) {
      badgePill.remove();
      const label = element.findProperty('label')!;
      label.remove();

      const i18nLabel = element.findProperty('i18n-label');
      i18nLabel?.remove();
      let i18nLabelTransformed = '';
      if (i18nLabel) {
        i18nLabelTransformed = ' i18n';
        if (i18nLabel.nativeValue?.length) {
          i18nLabelTransformed += `="${i18nLabel.nativeValue}"`;
        }
      }

      const labelContent = label.isProperty ? `{{ ${label.nativeValue} }}` : label.nativeValue;
      element.insertStart(
        `<span *sbb-tab-label [sbbBadge]="${badgePill.nativeValue}"${i18nLabelTransformed}>${labelContent}</span>`
      );

      this._addBadgeModule(element.resource);
    }
  }

  private _addBadgeModule(resource: ResolvedResource) {
    try {
      const modulePath = findModule(this._migration.context.tree, dirname(resource.filePath));
      addModuleImportToModule(
        this._migration.context.tree,
        modulePath,
        'SbbBadgeModule',
        '@sbb-esta/angular/badge'
      );
    } catch {
      this._migration.logger.warn(
        `Unable to add SbbBadgeModule for usage in <sbb-tab> at ${resource.filePath}. Please add it manually.`
      );
    }
  }
}

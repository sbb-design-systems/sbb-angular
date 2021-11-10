import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbbLink usages to the new format.
 */
export class LinkMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbbLink usages';
  private _linkModeUsed = false;

  protected _shouldMigrate(element: Element): boolean {
    return this._hasAttribute(element, 'sbbLink');
  }

  override applyMigration() {
    super.applyMigration();
    if (this._linkModeUsed) {
      this._migration.logger.warn('  Automatic migration failed for some a[sbbLink] instances.');
      this._migration.logger.warn('  Check generated TODO in templates.');
      this._migration.logger.warn(
        '  See https://angular.app.sbb.ch/angular/components/button for reference.'
      );
      this._migration.logger.info('');
    }
  }

  protected _migrate(element: MigrationElement) {
    const sbbLink = element.findProperty('sbbLink')!;
    const mode = element.findProperty('mode');
    const icon = element.findProperty('icon');
    if (mode) {
      this._linkModeUsed = true;
      element.insertStart(
        `<!-- TODO: sbbLink[mode] is no longer available. Maybe you want to use a link group? See https://angular.app.sbb.ch/angular/components/button on how to use. -->`
      );
      mode.remove();
    }
    sbbLink.replace('sbb-link');
    if (!icon) {
      // Do nothing, if no icon specified
    } else if (icon.value === 'download') {
      icon.replace('svgIcon="kom:download-small"');
    } else {
      icon.remove();
    }
  }
}

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
      this._migration.logger.warn('  sbbLink[mode] is no longer available.');
      this._migration.logger.warn('  Maybe you want to use a link group?');
      this._migration.logger.warn(
        '  See https://angular.app.sbb.ch/angular/components/button on how to use.'
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
      mode.remove();
    }
    sbbLink.replace('sbb-link');
    if (!icon) {
      // Do nothing, if no icon specified
    } else if (icon.value === 'download') {
      icon.replace('indicatorIcon="kom:download-small"');
    } else {
      icon.remove();
    }
  }
}

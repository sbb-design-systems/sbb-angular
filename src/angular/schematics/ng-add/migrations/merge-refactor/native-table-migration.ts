import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that handles table specific migrations.
 */
export class NativeTableMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating table usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'table');
  }

  // Adds css class 'sbb-table' if not present
  protected _migrate(element: MigrationElement) {
    if (element.findProperty('sbbTable')) {
      return;
    }
    const classAttribute = element.findProperty('class');
    if (classAttribute?.nativeValue.includes('sbb-table')) {
      return;
    }
    if (classAttribute) {
      classAttribute.replaceValue(`${classAttribute.nativeValue} sbb-table`);
      return;
    } else {
      element.appendProperty('class', 'sbb-table');
    }
  }
}

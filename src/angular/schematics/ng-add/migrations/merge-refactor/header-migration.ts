import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-header usages to the new format.
 */
export class HeaderMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-header usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._hasAttribute(element, 'sbb-header');
  }

  protected _migrate(element: MigrationElement) {
    const classAttribute = element.findProperty('class');
    if (!classAttribute) {
      element.appendProperty('class', 'sbb-header-fixed-columns');
    } else if (!classAttribute.nativeValue.includes('sbb-header-flexible')) {
      classAttribute.appendValue(' sbb-header-fixed-columns');
    } else if (classAttribute.nativeValue.trim() === 'sbb-header-flexible') {
      classAttribute.remove();
    } else if (
      classAttribute.nativeValue.match(
        /(^sbb-header-flexible | sbb-header-flexible | sbb-header-flexible$)/
      )
    ) {
      classAttribute.replaceValue(
        classAttribute.nativeValue.replace(
          /(^sbb-header-flexible | sbb-header-flexible | sbb-header-flexible$)/,
          ''
        )
      );
    }
  }
}

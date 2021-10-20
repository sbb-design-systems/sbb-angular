import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-usermenu usages to the new format.
 */
export class UsermenuMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-usermenu usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-usermenu');
  }

  protected _migrate(element: MigrationElement) {
    element
      .findElements((node) =>
        node.attrs?.some((value) =>
          value.name.toUpperCase().includes('routerLinkActive'.toUpperCase())
        )
      )
      .map((value) => value.findPropertyByValue('sbb-selected'))
      .forEach((value) => value?.replaceValue('sbb-active'));
  }
}

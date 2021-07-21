import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that updates sbb-search usages to the new format.
 */
export class SearchMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-search usages';
  private _searchProperties = ['(search)', 'class'];

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-search');
  }

  protected _migrate(element: MigrationElement) {
    const properties = element
      .properties()
      .filter((p) => !this._searchProperties.includes(p.attribute.name));
    properties.forEach((p) => p.remove());

    element.insertStart(`<input ${properties.map((p) => p.toString()).join(' ')} />`);
  }
}

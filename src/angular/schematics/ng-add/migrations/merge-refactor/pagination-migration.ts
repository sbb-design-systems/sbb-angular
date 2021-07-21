import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that replaces <sbb-pagination> instances with <sbb-paginator>.
 */
export class PaginationMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-pagination usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-pagination');
  }

  protected _migrate(element: MigrationElement) {
    const pageChangeProperty = element.findProperty('pageChange');
    const length = element.findProperty('length');
    if (pageChangeProperty) {
      pageChangeProperty.rename('(page)');
    }
    if (length) {
      length.replaceValue(
        `TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10`
      );
    }
  }
}

import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that replaces <sbb-pagination> instances with <sbb-paginator>.
 */
export class PaginationMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-pagination and sbb-paginator usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-pagination') || this._isElement(element, 'sbb-paginator');
  }

  protected _migrate(element: MigrationElement) {
    const pageChangeProperty = element.findProperty('pageChange');
    const length = element.findProperty('length');
    const classList = element.findProperty('class');

    if (classList) {
      classList.appendValue(`${classList.value?.length ? ' ' : ''}sbb-divider-small-top`);
    } else {
      element.appendProperty('class', 'sbb-divider-small-top');
    }

    if (element.is('sbb-paginator')) {
      return;
    }

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

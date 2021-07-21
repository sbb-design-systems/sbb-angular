import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

export class TagMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-tag usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-tag');
  }

  protected _migrate(element: MigrationElement) {
    const label = element.findProperty('label')!;
    label.remove();
    element.insertStart(label.toTextNode());
  }
}

import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

const replacements = [
  {
    replace: 'sbbTable',
    replaceWith: 'sbb-table',
  },
  {
    replace: 'sbbHeaderRow',
    replaceWith: 'sbb-header-row',
  },
  {
    replace: 'sbbRow',
    replaceWith: 'sbb-row',
  },
  {
    replace: 'sbbFooterRow',
    replaceWith: 'sbb-footer-row',
  },
  {
    replace: 'sbbHeaderCell',
    replaceWith: 'sbb-header-cell',
  },
  {
    replace: 'sbbCell',
    replaceWith: 'sbb-cell',
  },
  {
    replace: 'sbbFooterCell',
    replaceWith: 'sbb-footer-cell',
  },
];

/**
 * Migration that handles sbb-table specific migrations.
 */
export class TableMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbbTable usages';
  protected _shouldAlertSelectedCssClass: boolean = false;

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'table') && this._hasAttribute(element, 'sbbTable');
  }

  protected _migrate(element: MigrationElement) {
    replacements.forEach((attribute) => {
      const foundElementsToReplace = element.findElements((node) =>
        this._hasAttribute(node, attribute.replace)
      );

      [element, ...foundElementsToReplace].forEach((node) =>
        node.findProperty(attribute.replace)?.rename(attribute.replaceWith)
      );
    });

    const hasClickOnTrTag = element.findElements(
      (node) =>
        node.tagName?.toUpperCase() === 'tr'.toUpperCase() &&
        node.attrs.some((attr) => attr.name.toUpperCase() === '(click)'.toUpperCase())
    ).length;

    if (hasClickOnTrTag) {
      this._shouldAlertSelectedCssClass = true;
    }
  }

  override applyMigration() {
    super.applyMigration();

    if (this._shouldAlertSelectedCssClass) {
      this._migration.logger.warn(
        `  There was at least one (click) handler on a '<tr>'-tag found.`
      );
      this._migration.logger.warn(
        `  If a row is selectable, check if the css class 'sbb-table-row-selected' could conditionally be applied to the '<tr>'-tag.`
      );
      this._migration.logger.warn(
        `  Example: <tr (click)="selection.toggle()" [class.sbb-table-row-selected]="selection.isSelected(row)">.`
      );
      this._migration.logger.warn(
        '  See https://angular.app.sbb.ch/angular/components/table or (https://angular.app.sbb.ch/angular/guides/migration-guide) for reference.'
      );
      this._migration.logger.info('');
    }
  }
}

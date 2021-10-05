import type { Element } from 'parse5';

import { MigrationElement, MigrationElementProperty } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that handles standard sbb-table specific migrations.
 */
export class StandardTableMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-table usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-table');
  }

  protected _migrate(element: MigrationElement) {
    const tableId = element.findProperty('tableId');
    const tableLabelledBy = element.findProperty('tableLabelledBy');
    const tableAlignment = element.findProperty('tableAlignment');
    const pinMode = element.findProperty('pinMode');
    const tableClass = element.findProperty('tableClass');

    element.rename('sbb-table-wrapper');
    element.insertStart(
      `<table ${this._tableClassString(tableClass, tableAlignment)}${this._tableIdString(
        tableId
      )}${this._labelledByString(tableLabelledBy)}>${
        tableAlignment?.isProperty
          ? '<!-- TODO: Could not migrate tableAlignment property, please manually add css class (see documentation) -->'
          : ''
      }${
        pinMode && !pinMode.nativeValue.includes('off')
          ? '<!-- TODO: Could not migrate pinMode of former sbb-table, please manually add sticky css classes or migrate to more powerful [sbb-table] attribute usage and use its sticky modes there (see documentation) -->'
          : ''
      }`
    );
    tableClass?.remove();
    tableId?.remove();
    tableLabelledBy?.remove();
    tableAlignment?.remove();
    pinMode?.remove();

    element.insertBeforeEnd('</table>');
  }

  private _tableClassString(
    tableClass?: MigrationElementProperty,
    tableAlignment?: MigrationElementProperty
  ) {
    if (!tableClass && !tableAlignment) {
      return 'class="sbb-table"';
    }

    if (tableAlignment?.isProperty) {
      tableAlignment = undefined;
    }

    let returnString: string;
    let propertyOutput = false;

    if (tableClass?.isProperty) {
      returnString = `[class]="'sbb-table'`;
      propertyOutput = true;
    } else {
      returnString = `class="sbb-table`;
    }

    if (tableClass) {
      if (propertyOutput) {
        returnString += ` + ${tableClass.nativeValue}`;
      } else {
        returnString += ` ${tableClass.nativeValue}`;
      }
    }

    if (tableAlignment && tableAlignment.nativeValue !== 'none') {
      if (propertyOutput) {
        returnString += ` + 'sbb-table-align-${tableAlignment.nativeValue}'`;
      } else {
        returnString += ` sbb-table-align-${tableAlignment.nativeValue}`;
      }
    }

    return returnString + '"';
  }

  private _tableIdString(tableId?: MigrationElementProperty) {
    if (!tableId) {
      return '';
    }
    if (tableId.isAttribute) {
      return ` id="${tableId.nativeValue}"`;
    }
    return ` [attr.id]="${tableId.nativeValue}"`;
  }

  private _labelledByString(labelledBy?: MigrationElementProperty) {
    if (!labelledBy) {
      return '';
    }
    if (labelledBy.isAttribute) {
      return ` aria-labelledby="${labelledBy.nativeValue}"`;
    }
    return ` [attr.aria-labelledby]="${labelledBy.nativeValue}"`;
  }
}

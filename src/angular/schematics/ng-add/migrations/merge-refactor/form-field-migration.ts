import type { Element } from 'parse5';

import { MigrationElement } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

/**
 * Migration that replaces .sbb-form-field-errorless with .sbb-form-field-flexible-errors.
 */
export class FormFieldMigration extends RefactorMigration {
  protected _migrateMessage: string =
    'Replacing .sbb-form-field-errorless with .sbb-form-field-flexible-errors';

  protected _shouldMigrate(element: Element): boolean {
    return (
      element.attrs &&
      element.attrs.some(
        (a) => a.name.toLowerCase() === 'class' && a.value.includes('sbb-form-field-errorless')
      )
    );
  }

  protected _migrate(element: MigrationElement) {
    const classAttribute = element.findProperty('class');
    classAttribute?.replaceValue(
      classAttribute.nativeValue.replace(
        'sbb-form-field-errorless',
        'sbb-form-field-flexible-errors'
      )
    );
  }
}

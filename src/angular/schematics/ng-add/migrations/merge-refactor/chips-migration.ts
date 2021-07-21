import type { Attribute, Element } from 'parse5';

import { MigrationElement, MigrationElementProperty } from '../../../utils';

import { RefactorMigration } from './refactor-migration';

export class ChipsMigration extends RefactorMigration {
  protected _migrateMessage: string = 'Migrating sbb-chip-input usages';

  protected _shouldMigrate(element: Element): boolean {
    return this._isElement(element, 'sbb-chip-input');
  }

  protected _migrate(element: MigrationElement) {
    let template: string;
    const formControlNameProperty = element.findProperty('formControlName');
    const formControlProperty = element.findProperty('formControl');
    const ngModelProperty = element.findProperty('ngModel');
    const autocompleteProperty = element.findProperty('sbbAutocomplete');

    if (formControlNameProperty) {
      let accessFormControlString = `'${formControlNameProperty.nativeValue}'`;
      if (formControlNameProperty.nativeValue.startsWith('{{')) {
        accessFormControlString = `${formControlNameProperty.nativeValue
          .replace('{{', '')
          .replace('}}', '')
          .trim()}`;
      } else if (formControlNameProperty.isProperty) {
        accessFormControlString = `${formControlNameProperty.nativeValue}`;
      }

      const formGroupName = this._findFormGroupName(element.element);
      if (formGroupName) {
        template = this._createTemplate(
          `${formGroupName}.get(${accessFormControlString}).value`,
          autocompleteProperty
        );
      } else {
        template = this._createTemplate(
          `formGroup.get(${accessFormControlString}).value`,
          autocompleteProperty,
          '<!-- TODO: Replace formGroup with your formGroup variable name -->'
        );
      }
    } else if (formControlProperty) {
      template = this._createTemplate(
        `${formControlProperty.nativeValue}.value`,
        autocompleteProperty
      );
    } else if (ngModelProperty) {
      template = this._createTemplate(`${ngModelProperty.nativeValue}`, autocompleteProperty);
    } else {
      template = this._createTemplate(
        'formControl.value',
        autocompleteProperty,
        '<!-- TODO: To make this work, create a formControl or ngModel -->'
      );
    }

    element.insertStart(template);

    if (autocompleteProperty) {
      autocompleteProperty.remove();
    }
  }

  private _createTemplate(
    iterable: string,
    autocompleteProperty?: MigrationElementProperty,
    todo = ''
  ): string {
    const autocompleteString = autocompleteProperty
      ? `[sbbAutocomplete]="${autocompleteProperty.nativeValue}" `
      : '';

    return `${todo}<sbb-chip *ngFor="let element of ${iterable}" [value]="element">{{ element }}</sbb-chip><input sbbChipInput ${autocompleteString}/>`;
  }

  private _findFormGroupName(element: Element): string | null {
    let formGroupName: string | null = null;
    while (element.parentNode && element.parentNode['attrs'] && !formGroupName) {
      element = element.parentNode as Element;

      const formGroupElement = element.attrs.find(
        (attribute: Attribute) => attribute.name.toUpperCase() === '[formGroup]'.toUpperCase()
      );

      if (formGroupElement) {
        formGroupName = formGroupElement.value;
      }
    }

    return formGroupName;
  }
}

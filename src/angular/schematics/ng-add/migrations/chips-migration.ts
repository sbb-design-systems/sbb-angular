import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';
import type { Attribute, Element } from 'parse5';

import {
  iterateNodes,
  MigrationElement,
  MigrationElementProperty,
  MigrationRecorderRegistry,
  nodeCheck,
} from '../../utils';

export class ChipsMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _chipInputs = new MigrationRecorderRegistry(this);

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, async (node) => {
      if (nodeCheck(node).is('sbb-chip-input')) {
        this._chipInputs.add(template, node);
      }
    });
  }

  postAnalysis() {
    if (!this._chipInputs.empty) {
      this.logger.info('Migrating sbb-chip-input usages');
      this._chipInputs.forEach((e) => this._handleChipInput(e));
    }
  }

  private _handleChipInput(chip: MigrationElement) {
    let template;
    const formControlNameProperty = chip.findProperty('formControlName');
    const formControlProperty = chip.findProperty('formControl');
    const ngModelProperty = chip.findProperty('ngModel');
    const autocompleteProperty = chip.findProperty('sbbAutocomplete');

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

      const formGroupName = this._findFormGroupName(chip.element);
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

    chip.insertStart(template);

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

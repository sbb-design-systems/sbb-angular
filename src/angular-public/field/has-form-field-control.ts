import { ElementRef } from '@angular/core';
import { FormFieldControl } from '@sbb-esta/angular-core/forms';

/** @deprecated Use type import of FieldComponent */
export interface HasFormFieldControl {
  _control: FormFieldControl<any>;
  _elementRef: ElementRef<HTMLElement>;
}

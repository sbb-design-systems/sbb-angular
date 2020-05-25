import { InjectionToken } from '@angular/core';

import { HasFormFieldControl } from './has-form-field-control';

// TODO: Replace with type import of FieldComponent
export const FORM_FIELD = new InjectionToken<HasFormFieldControl>('SBB_FORM_FIELD');

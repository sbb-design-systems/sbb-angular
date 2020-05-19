import { InjectionToken } from '@angular/core';

import type { FieldComponent } from './field/field.component';

export const FORM_FIELD = new InjectionToken<FieldComponent>('SBB_FORM_FIELD');

import { Directive, forwardRef, Provider } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS } from '@angular/forms';

/**
 * @deprecated No longer used, `SbbCheckbox` implements required validation directly.
 * @breaking-change 19.0.0
 */
export const SBB_CHECKBOX_REQUIRED_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SbbCheckboxRequiredValidator),
  multi: true,
};

/**
 * Validator for SBB checkbox's required attribute in template-driven checkbox.
 * Current CheckboxRequiredValidator only work with `input type=checkbox` and does not
 * work with `sbb-checkbox`.
 * @deprecated No longer used, `MatCheckbox` implements required validation directly.
 * @breaking-change 19.0.0
 *
 */
@Directive({
  selector: `sbb-checkbox[required][formControlName],
             sbb-checkbox[required][formControl], sbb-checkbox[required][ngModel]`,
  providers: [SBB_CHECKBOX_REQUIRED_VALIDATOR],
  standalone: true,
})
export class SbbCheckboxRequiredValidator extends CheckboxRequiredValidator {}

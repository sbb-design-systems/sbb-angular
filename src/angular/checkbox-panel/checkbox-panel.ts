import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbCheckbox } from '@sbb-esta/angular/checkbox';

/**
 * Provider Expression that allows sbb-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const SBB_CHECKBOX_PANEL_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SbbCheckboxPanel),
  multi: true,
};

@Component({
  selector: 'sbb-checkbox-panel',
  templateUrl: './checkbox-panel.html',
  exportAs: 'sbbCheckboxPanel',
  host: {
    class: 'sbb-checkbox-panel sbb-selection-panel-item sbb-checkbox sbb-selection-item',
    '[id]': 'id',
    '[attr.tabindex]': 'null',
    '[class.sbb-selection-indeterminate]': 'indeterminate',
    '[class.sbb-selection-checked]': 'checked',
    '[class.sbb-selection-disabled]': 'disabled',
  },
  providers: [SBB_CHECKBOX_PANEL_CONTROL_VALUE_ACCESSOR],
  inputs: ['tabIndex'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbCheckboxPanel extends SbbCheckbox {}

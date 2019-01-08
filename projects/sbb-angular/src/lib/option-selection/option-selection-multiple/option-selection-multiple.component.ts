import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  Input,
  HostBinding
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CheckboxComponent } from '../../checkbox/checkbox/checkbox.component';

let counter = 0;

@Component({
  selector: 'sbb-option-selection-multiple',
  templateUrl: './option-selection-multiple.component.html',
  styleUrls: ['./option-selection-multiple.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionSelectionMultipleComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionSelectionMultipleComponent extends CheckboxComponent {

  /**
   * Label of a option selection multiple.
   */
  @Input()
  label: string;
  /**
   * Subtitle of a option selection multiple.
   */
  @Input()
  subtitle?: string;

  /**
     * Option selection multiple identifier.
     */
  @Input()
  @HostBinding('id')
  inputId = `sbb-option-selection-multiple-${counter++}`;

  /**
   * Returns the subtitle of a option selection.
   */
  get hasSubtitle() {
    return !!this.subtitle;
  }

}

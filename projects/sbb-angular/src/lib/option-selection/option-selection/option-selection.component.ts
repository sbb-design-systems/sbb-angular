import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  Input,
  HostBinding
} from '@angular/core';
import { NG_VALUE_ACCESSOR,  } from '@angular/forms';
import { RadioButtonComponent } from '../../radio-button/radio-button';

let counter = 0;

@Component({
  selector: 'sbb-option-selection',
  templateUrl: './option-selection.component.html',
  styleUrls: ['./option-selection.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionSelectionComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionSelectionComponent extends RadioButtonComponent {
  /**
   * Label of a option selection.
   */
  @Input()
  label: string;
  /**
   * Subtitle of a option selection.
   */
  @Input()
  subtitle?: string;

  /**
     * Option selection identifier
     */
  @Input()
  @HostBinding('id')
  inputId = `sbb-option-selection-${counter++}`;

  /**
   * Returns the subtitle of a option selection.
   */
  get hasSubtitle() {
    return !!this.subtitle;
  }

}

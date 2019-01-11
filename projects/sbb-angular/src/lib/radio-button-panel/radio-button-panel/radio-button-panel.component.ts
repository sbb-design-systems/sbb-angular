import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  Input,
  HostBinding,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR,  } from '@angular/forms';
import { RadioButtonComponent } from '../../radio-button/radio-button';

let counter = 0;

@Component({
  selector: 'sbb-radio-button-panel',
  templateUrl: './radio-button-panel.component.html',
  styleUrls: ['./radio-button-panel.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButtonPanelComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RadioButtonPanelComponent extends RadioButtonComponent {
  /**
   * Label of a radio button panel.
   */
  @Input()
  label: string;
  /**
   * Subtitle of a radio button panel.
   */
  @Input()
  subtitle?: string;

  /**
     * Radio button panel identifier
     */
  @Input()
  @HostBinding('id')
  inputId = `sbb-radio-button-panel-${counter++}`;

  /**
   * Returns the subtitle of a radio button panel.
   */
  get hasSubtitle() {
    return !!this.subtitle;
  }

}

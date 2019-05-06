import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { CheckboxComponent } from '../../checkbox/checkbox/checkbox.component';

let counter = 0;

@Component({
  selector: 'sbb-checkbox-panel',
  templateUrl: './checkbox-panel.component.html',
  styleUrls: ['./checkbox-panel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxPanelComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CheckboxPanelComponent extends CheckboxComponent {
  /**
   * Label of a multiple checkbox panel.
   */
  @Input()
  label: string;
  /**
   * Subtitle of a multiple checkbox panel.
   */
  @Input()
  subtitle?: string;

  /**
   * Multiple checkbox panel identifier.
   */
  @Input()
  @HostBinding('id')
  inputId = `sbb-checkbox-panel-${counter++}`;

  /**
   * Returns the subtitle of a multiple checkbox panel.
   */
  get hasSubtitle() {
    return !!this.subtitle;
  }
}

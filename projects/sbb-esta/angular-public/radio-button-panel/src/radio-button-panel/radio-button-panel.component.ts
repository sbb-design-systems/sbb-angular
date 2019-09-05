import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  Injector,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  RadioButtonComponent,
  RadioButtonRegistryService
} from '@sbb-esta/angular-public/radio-button';

let counter = 0;

@Component({
  selector: 'sbb-radio-button-panel',
  templateUrl: './radio-button-panel.component.html',
  styleUrls: ['./radio-button-panel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonPanelComponent),
      multi: true
    }
  ],
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

  constructor(
    changeDetector: ChangeDetectorRef,
    registry: RadioButtonRegistryService,
    injector: Injector
  ) {
    super(changeDetector, registry, injector);
  }
}

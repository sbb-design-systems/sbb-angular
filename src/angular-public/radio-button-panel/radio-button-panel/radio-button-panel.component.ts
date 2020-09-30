import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbRadioButton, SbbRadioGroup } from '@sbb-esta/angular-core/radio-button';

@Component({
  selector: 'sbb-radio-button-panel',
  templateUrl: './radio-button-panel.component.html',
  styleUrls: ['./radio-button-panel.component.css'],
  inputs: ['tabIndex'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbRadioButtonPanel),
      multi: true,
    },
    { provide: SbbRadioButton, useExisting: SbbRadioButtonPanel },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbRadioButtonPanel extends SbbRadioButton {
  /** Label of a radio button panel. */
  @Input()
  label: string;
  /** Subtitle of a radio button panel. */
  @Input()
  subtitle?: string;

  constructor(
    @Optional() radioGroup: SbbRadioGroup,
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    focusMonitor: FocusMonitor,
    radioDispatcher: UniqueSelectionDispatcher
  ) {
    super(radioGroup, changeDetector, elementRef, focusMonitor, radioDispatcher);
  }
}

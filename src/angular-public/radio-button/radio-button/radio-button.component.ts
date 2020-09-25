import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  SbbRadioButton as SbbRadioButtonBase,
  SbbRadioGroup,
} from '@sbb-esta/angular-core/radio-button';

@Component({
  selector: 'sbb-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css'],
  inputs: ['tabIndex'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbRadioButton),
      multi: true,
    },
    { provide: SbbRadioButtonBase, useExisting: SbbRadioButton },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbRadioButton extends SbbRadioButtonBase {
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

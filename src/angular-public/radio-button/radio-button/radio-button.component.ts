import { FocusMonitor } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Optional
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButton, RadioGroupDirective } from '@sbb-esta/angular-core/radio-button';

@Component({
  selector: 'sbb-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css'],
  inputs: ['tabIndex'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    },
    { provide: RadioButton, useExisting: RadioButtonComponent }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonComponent extends RadioButton {
  constructor(
    @Optional() radioGroup: RadioGroupDirective,
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    focusMonitor: FocusMonitor,
    radioDispatcher: UniqueSelectionDispatcher
  ) {
    super(radioGroup, changeDetector, elementRef, focusMonitor, radioDispatcher);
  }
}

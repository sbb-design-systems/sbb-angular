import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxBase, SbbCheckboxChange } from '@sbb-esta/angular-core/base';

export interface CheckboxChange extends SbbCheckboxChange<CheckboxComponent> {}

@Component({
  selector: 'sbb-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends CheckboxBase<CheckboxChange> {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(changeDetectorRef, focusMonitor, elementRef, tabIndex);
  }
}

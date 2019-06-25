import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  forwardRef, Input,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseCheckbox } from './base-checkbox';

@Component({
  selector: 'sbb-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
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
export class CheckboxComponent extends BaseCheckbox {
  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }
}

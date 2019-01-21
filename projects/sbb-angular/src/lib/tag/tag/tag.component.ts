import { Component, forwardRef, ChangeDetectionStrategy, Input, HostBinding, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxComponent } from '../../checkbox/checkbox/checkbox.component';

let counter = 0;

@Component({
  selector: 'sbb-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent extends CheckboxComponent {

  /**
   * Label of the tag.
   */
  @Input()
  label: string;

  @Input()
  amount = 0;

  @Input()
  @HostBinding('id')
  inputId = `sbb-tag-${counter++}`;

  linkMode = true;

  constructor(private _changeDetector: ChangeDetectorRef) {
    super(_changeDetector);
  }

  tagMarkForCheck() {
    this._changeDetector.markForCheck();
  }

  tagDetectChanges() {
    this._changeDetector.detectChanges();
  }

}

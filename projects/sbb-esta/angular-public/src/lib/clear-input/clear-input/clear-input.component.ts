import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { ClearInputTargetDirective } from '../clear-input.target.directive';

@Component({
  selector: 'sbb-clear-input',
  templateUrl: './clear-input.component.html',
  styleUrls: ['./clear-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClearInputComponent implements OnInit {
  /** @docs-private */
  @HostBinding('class.sbb-clear-input') cssClass = true;

  /**
   * Target input element to attach to.
   */
  @Input()
  target: ClearInputTargetDirective;

  /**
   * Default value to reset to.
   * If not specified will default to '' for generic inputs and current date for datepickers.
   */
  @Input()
  resetValue = '';

  /**
   * Controls the enabled/disabled status of the component.
   * Will automatically disable if target input is disabled.
   */
  @Input()
  @HostBinding('attr.disabled')
  get disabled() {
    return this._disabled || this.target.ngControl.disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean;

  /**
   * Visualization mode.
   *  - auto: will hide the clear input button if target is empty
   *  - fixed: will always show the clear input button
   */
  @Input() mode: 'auto' | 'fixed' = 'auto';

  /**
   * Read-only, returns current visibility for the component.
   */
  @HostBinding('attr.hidden')
  get visible() {
    return this.mode === 'auto' && !this.target.ngControl.value ? true : null;
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.target.ngControl.valueChanges.subscribe(() => {
      this._changeDetectorRef.detectChanges();
    });
  }

  @HostListener('click')
  onClick() {
    console.log(this.disabled, this.target.ngControl);
    if (!this.disabled) {
      this.target.ngControl.reset(this.resetValue);
    }
  }
}

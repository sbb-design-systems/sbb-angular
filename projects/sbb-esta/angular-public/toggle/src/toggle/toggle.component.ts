import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioChange, RadioGroupDirective } from '@sbb-esta/angular-core/radio-button';
import { first } from 'rxjs/operators';

import { ToggleOptionComponent } from '../toggle-option/toggle-option.component';
import { SBB_TOGGLE_COMPONENT } from '../toggle.base';

// TODO: Change this to a directive
@Component({
  selector: 'sbb-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    },
    {
      provide: SBB_TOGGLE_COMPONENT,
      useExisting: ToggleComponent
    },
    {
      provide: RadioGroupDirective,
      useExisting: ToggleComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToggleComponent extends RadioGroupDirective
  implements ControlValueAccessor, OnInit, OnDestroy, AfterContentInit {
  /** @docs-private */
  @HostBinding('class.sbb-toggle')
  toggleClass = true;

  /**
   * Indicates radio button name in formControl
   * @deprecated
   */
  @Input()
  formControlName: string;

  /**
   * Event generated on a change of sbb-toggle.
   * @deprecated Use change event.
   */
  @Output()
  toggleChange: EventEmitter<RadioChange> = this.change;

  /**
   * Reference to sbb-toggle-options.
   * @deprecated
   */
  @ContentChildren(forwardRef(() => ToggleOptionComponent))
  toggleOptions: QueryList<ToggleOptionComponent>;

  /**
   * @deprecated
   * @docs-private
   */
  get onChange() {
    return this._controlValueAccessorChangeFn;
  }

  constructor(private _zone: NgZone, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  // TODO: Remove
  ngOnInit() {}

  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._zone.onStable.pipe(first()).subscribe(() =>
      this._zone.run(() => {
        this._checkNumOfOptions();
        if (this._radios.toArray().every(r => this.value !== r.value)) {
          this.value = this._radios.first.value;
        }
      })
    );
  }

  // TODO: Remove
  ngOnDestroy() {}

  /** @deprecated Use .checked instead */
  uncheck() {}

  private _checkNumOfOptions(): void {
    if (this._radios.length !== 2) {
      throw new Error(
        `You must set two sbb-toggle-option into the sbb-toggle component. ` +
          `Currently there are ${this._radios.length} options.`
      );
    }
  }
}

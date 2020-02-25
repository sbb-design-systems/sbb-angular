import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  NgZone,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioGroupDirective } from '@sbb-esta/angular-core/radio-button';
import { first } from 'rxjs/operators';

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
      provide: RadioGroupDirective,
      useExisting: ToggleComponent
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToggleComponent extends RadioGroupDirective
  implements ControlValueAccessor, AfterContentInit {
  /** @docs-private */
  @HostBinding('class.sbb-toggle')
  toggleClass = true;

  constructor(private _zone: NgZone, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

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

  private _checkNumOfOptions(): void {
    if (this._radios.length !== 2) {
      throw new Error(
        `You must set two sbb-toggle-option into the sbb-toggle component. ` +
          `Currently there are ${this._radios.length} options.`
      );
    }
  }
}

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbRadioGroup } from '@sbb-esta/angular-core/radio-button';
import { take } from 'rxjs/operators';

import { SbbToggleOption } from '../toggle-option/toggle-option.component';

@Component({
  selector: 'sbb-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbToggle),
      multi: true,
    },
    {
      provide: SbbRadioGroup,
      useExisting: SbbToggle,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-toggle',
  },
})
export class SbbToggle
  extends SbbRadioGroup<SbbToggleOption>
  implements ControlValueAccessor, AfterContentInit {
  constructor(private _zone: NgZone, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._zone.onStable.pipe(take(1)).subscribe(() =>
      this._zone.run(() => {
        this._checkNumOfOptions();
        if (this._radios.toArray().every((r) => this.value !== r.value)) {
          this.value = this._radios.first.value;
        }
      })
    );

    this.change.subscribe(() => this._changeDetector.markForCheck());
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

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input,
  Optional
} from '@angular/core';

import { FORM_FIELD } from '../form-field-token';
import { HasFormFieldControl } from '../has-form-field-control';

@Component({
  selector: 'sbb-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelComponent {
  /**
   * Label of a input text
   */
  @Input()
  get for() {
    return this._for || this._inputId();
  }
  set for(value: string) {
    this._for = value;
  }
  private _for: string;

  constructor(@Inject(FORM_FIELD) @Optional() private _formField: HasFormFieldControl) {}

  private _inputId() {
    return this._hasFormFieldControl() ? this._formField._control.id : undefined;
  }

  @HostListener('click', ['$event'])
  onContainerClick($event: Event) {
    if (this._hasFormFieldControl() && this._formField._control.onContainerClick) {
      this._formField._control.onContainerClick($event);
    }
  }

  private _hasFormFieldControl(): boolean {
    return !!(this._formField && this._formField._control);
  }
}

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
  styleUrls: ['./label.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelComponent {
  /**
   * Label of a input text
   */
  @Input()
  get for(): string | null {
    return this._for || this._inputId();
  }
  set for(value: string | null) {
    this._for = value;
  }
  private _for: string | null = null;

  constructor(@Inject(FORM_FIELD) @Optional() private _formField: HasFormFieldControl) {}

  private _inputId() {
    return this._hasFormFieldControl() ? this._formField._control.id : null;
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

import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { TypeRef } from '@sbb-esta/angular-core/common-behaviors';

import type { SbbField } from '../field/field.component';
import { SBB_FORM_FIELD } from '../form-field-token';

@Component({
  selector: 'sbb-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-label',
  },
})
export class SbbLabel {
  /** Label of a input text */
  @Input()
  get for(): string | null {
    return this._for || this._inputId();
  }
  set for(value: string | null) {
    this._for = value;
  }
  private _for: string | null = null;

  constructor(@Inject(SBB_FORM_FIELD) @Optional() private _formField: TypeRef<SbbField>) {}

  private _inputId() {
    return this._hasFormFieldControl() ? this._formField._control.id : null;
  }

  @HostListener('click', ['$event'])
  onContainerClick($event: TypeRef<Event>) {
    if (this._hasFormFieldControl() && this._formField._control.onContainerClick) {
      this._formField._control.onContainerClick($event);
    }
  }

  private _hasFormFieldControl(): boolean {
    return !!(this._formField && this._formField._control);
  }
}

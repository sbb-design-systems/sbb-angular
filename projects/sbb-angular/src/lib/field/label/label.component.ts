import { Component, Input, ChangeDetectionStrategy, Optional, Inject } from '@angular/core';
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
  get for() { return this._for || this.inputId(); }
  set for(value: string) { this._for = value; }
  private _for: string;

  constructor(
    @Inject(FORM_FIELD) @Optional() private formField: HasFormFieldControl,
  ) { }

  private inputId() {
    return this.formField && this.formField._control ? this.formField._control.id : undefined;
  }
}

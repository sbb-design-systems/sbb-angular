import { Component, Input, ChangeDetectionStrategy, InjectionToken, Optional, Inject, HostBinding } from '@angular/core';
import { FormFieldControl } from '../../_common/common';

export const LABEL_CONTAINER = new InjectionToken<{ _control: FormFieldControl<any> }>('SBB_LABEL_CONTAINER');

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
    @Inject(LABEL_CONTAINER) @Optional() private formField: { _control: FormFieldControl<any> },
  ) { }

  private inputId() {
    return this.formField && this.formField._control ? this.formField._control.id : undefined;
  }
}

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'sbb-breadcrumb',
  exportAs: 'sbbBreadcrumb',
  host: {
    class: 'sbb-breadcrumb sbb-icon-fit',
    role: 'listitem',
  },
})
export class SbbBreadcrumb {
  @Input()
  get root() {
    return this._root;
  }
  set root(value: any) {
    this._root = coerceBooleanProperty(value);
  }
  private _root: boolean = false;

  static ngAcceptInputType_root: BooleanInput;
}

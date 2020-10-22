import { Directive, Input } from '@angular/core';

let nextId = 0;

@Directive({
  selector: 'sbb-form-error, [sbbFormError]',
  host: {
    class: 'sbb-form-error',
    role: 'alert',
    '[attr.id]': 'id',
  },
})
export class SbbFormError {
  @Input() id = `sbb-form-error-${nextId++}`;
}

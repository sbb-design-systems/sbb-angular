import { Directive, HostBinding, Input } from '@angular/core';

let nextId = 0;

@Directive({
  selector: 'sbb-form-error, [sbbFormError]'
})
export class FormErrorDirective {
  @HostBinding()
  @Input()
  id = `sbb-form-error-${nextId++}`;
  @HostBinding('class.sbb-form-error') formErrorClass = true;
  @HostBinding('attr.role') role = 'alert';
}

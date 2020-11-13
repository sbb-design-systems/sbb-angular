import { Directive, InjectionToken, Input } from '@angular/core';

let nextId = 0;

/**
 * Injection token that can be used to reference instances of `SbbError`. It serves as
 * alternative token to the actual `SbbError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const SBB_ERROR = new InjectionToken<SbbError>('SbbError');

/** Single error message to be shown underneath the form field. */
@Directive({
  // TODO(v12,@sbb-esta/angular): Remove sbb-form-error, [sbbFormError]
  selector: 'sbb-error, [sbbError], sbb-form-error, [sbbFormError]',
  host: {
    class: 'sbb-error',
    role: 'alert',
    '[attr.id]': 'id',
  },
  providers: [{ provide: SBB_ERROR, useExisting: SbbError }],
})
export class SbbError {
  @Input() id: string = `sbb-error-${nextId++}`;
}

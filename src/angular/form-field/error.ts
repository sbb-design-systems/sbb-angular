import {
  Directive,
  ElementRef,
  HostAttributeToken,
  inject,
  InjectionToken,
  Input,
} from '@angular/core';

let nextId = 0;

/**
 * Injection token that can be used to reference instances of `SbbError`. It serves as
 * alternative token to the actual `SbbError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const SBB_ERROR = new InjectionToken<SbbError>('SbbError');

/** Single error message to be shown underneath the form field. */
@Directive({
  selector: 'sbb-error, [sbbError]',
  host: {
    class: 'sbb-error',
    '[attr.id]': 'id',
    'aria-atomic': 'true',
  },
  providers: [{ provide: SBB_ERROR, useExisting: SbbError }],
  standalone: true,
})
export class SbbError {
  @Input() id: string = `sbb-error-${nextId++}`;

  constructor(...args: unknown[]);
  constructor() {
    const ariaLive = inject(new HostAttributeToken('aria-live'), { optional: true });

    // If no aria-live value is set add 'polite' as a default. This is preferred over setting
    // role='alert' so that screen readers do not interrupt the current task to read this aloud.
    if (!ariaLive) {
      const elementRef = inject(ElementRef);
      elementRef.nativeElement.setAttribute('aria-live', 'polite');
    }
  }
}

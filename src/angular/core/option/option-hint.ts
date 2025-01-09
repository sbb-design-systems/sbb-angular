import { _IdGenerator } from '@angular/cdk/a11y';
import { Directive, inject } from '@angular/core';

@Directive({
  selector: 'sbb-option-hint',
  host: {
    class: 'sbb-option-hint sbb-label',
    '[attr.id]': 'id',
  },
})
export class SbbOptionHint {
  /** Unique ID to be used by autocomplete trigger's "aria-controls" property. */
  id: string = inject(_IdGenerator).getId('sbb-option-hint-');
}

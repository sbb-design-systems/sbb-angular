import { Directive } from '@angular/core';

/**
 * Option-hint IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextId = 0;

@Directive({
  selector: 'sbb-option-hint',
  host: {
    class: 'sbb-option-hint sbb-label',
    '[attr.id]': 'id',
  },
})
export class SbbOptionHint {
  /** Unique ID to be used by autocomplete trigger's "aria-controls" property. */
  id: string = `sbb-option-hint-${nextId++}`;
}

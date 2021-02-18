import { Component } from '@angular/core';

/**
 * Autocomplete-hint IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextId = 0;

@Component({
  selector: 'sbb-autocomplete-hint',
  templateUrl: './autocomplete-hint.html',
  host: {
    class: 'sbb-autocomplete-hint sbb-label',
    '[attr.id]': 'id',
  },
})
export class SbbAutocompleteHint {
  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  id: string = `sbb-autocomplete-hint-${nextId++}`;
}

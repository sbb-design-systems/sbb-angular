import { Component, HostBinding } from '@angular/core';

/**
 * Autocomplete-hint IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextId = 0;

@Component({
  selector: 'sbb-autocomplete-hint',
  templateUrl: './autocomplete-hint.component.html',
  styleUrls: ['./autocomplete-hint.component.css']
})
export class AutocompleteHintComponent {
  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  @HostBinding('attr.id')
  id = `sbb-autocomplete-hint-${nextId++}`;
}

import { Component, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Autocomplete-hint IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let nextId = 0;

@Component({
  selector: 'sbb-autocomplete-hint',
  templateUrl: './autocomplete-hint.component.html',
  styleUrls: ['./autocomplete-hint.component.scss']
})
export class AutocompleteHintComponent implements OnInit {
  /**
   * Takes classes set on the host sbb-autocomplete-hint element and applies them to the panel
   * inside the overlay container to allow for easy styling.
   */
  @Input('class')
  set classList(value: string) {
    if (value && value.length) {
      value.split(' ').forEach(className => (this._classList[className.trim()] = true));
      this._elementRef.nativeElement.className = '';
    }
  }

  _classList: { [key: string]: boolean } = {};

  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  id = `sbb-autocomplete-hint-${nextId++}`;

  constructor(private _elementRef: ElementRef<HTMLElement>) {}

  ngOnInit() {}
}

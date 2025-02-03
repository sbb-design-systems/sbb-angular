import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Directive applied to an element to make it usable
 * as a connection point for an autocomplete panel.
 */
@Directive({
  selector: '[sbbAutocompleteOrigin]',
  exportAs: 'sbbAutocompleteOrigin',
})
export class SbbAutocompleteOrigin {
  elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor(...args: unknown[]);
  constructor() {}
}

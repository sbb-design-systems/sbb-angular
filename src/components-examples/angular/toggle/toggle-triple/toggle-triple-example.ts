import { Component, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

/**
 * @title Toggle Triple
 * @order 40
 */
@Component({
  selector: 'sbb-toggle-triple-example',
  templateUrl: 'toggle-triple-example.html',
  encapsulation: ViewEncapsulation.None,
})
export class ToggleTripleExample {
  journey = new UntypedFormControl('option1');
}

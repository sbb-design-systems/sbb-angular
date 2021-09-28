import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Toggle Reactive
 * @order 10
 */
@Component({
  selector: 'sbb-toggle-reactive-example',
  templateUrl: './toggle-reactive-example.html',
  encapsulation: ViewEncapsulation.None,
})
export class ToggleReactiveExample {
  journey = new FormControl('ReturnJourney');
}

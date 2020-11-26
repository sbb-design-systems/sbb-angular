import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-toggle-reactive-example',
  templateUrl: './toggle-reactive-example.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ToggleReactiveExampleComponent {
  journey = new FormControl('ReturnJourney');
}

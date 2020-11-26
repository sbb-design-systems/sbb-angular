import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-toggle-template-driven-example',
  templateUrl: './toggle-template-driven-example.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ToggleTemplateDrivenExampleComponent {
  model = 'SingleJourney';
}

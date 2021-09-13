import { Component, ViewEncapsulation } from '@angular/core';

/**
 * @title Toggle Template Driven
 * @order 20
 */
@Component({
  selector: 'sbb-toggle-template-driven-example',
  templateUrl: './toggle-template-driven-example.html',
  encapsulation: ViewEncapsulation.None,
})
export class ToggleTemplateDrivenExample {
  model = 'SingleJourney';
}

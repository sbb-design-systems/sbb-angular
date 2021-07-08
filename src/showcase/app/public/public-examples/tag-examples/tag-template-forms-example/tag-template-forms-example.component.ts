import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-tag-template-forms-example',
  templateUrl: './tag-template-forms-example.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TagTemplateFormsExampleComponent {
  trains = false;
  cars = false;
  bicycles = true;
}

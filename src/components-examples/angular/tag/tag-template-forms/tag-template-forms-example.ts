import { Component, ViewEncapsulation } from '@angular/core';

/**
 * @title Tag Template Forms
 * @order 20
 */
@Component({
  selector: 'sbb-tag-template-forms-example',
  templateUrl: './tag-template-forms-example.html',
  encapsulation: ViewEncapsulation.None,
})
export class TagTemplateFormsExample {
  trains = false;
  cars = false;
  bicycles = true;
}

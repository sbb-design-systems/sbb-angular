import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbTagModule } from '@sbb-esta/angular/tag';

/**
 * @title Tag Template Forms
 * @order 20
 */
@Component({
  selector: 'sbb-tag-template-forms-example',
  templateUrl: 'tag-template-forms-example.html',
  imports: [SbbTagModule, FormsModule],
})
export class TagTemplateFormsExample {
  trains = false;
  cars = false;
  bicycles = true;
}

import { Component, NgModule } from '@angular/core';
import { SbbFormFieldControl } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

@Component({
  selector: 'test',
  template: `
    <sbb-form-field label="Test" class="sbb-form-field-flexible-errors">
      <input sbbInput>
    </sbb-form-field>
  `,
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent],
  imports: [SbbInputModule],
})
export class FormFieldModule {}

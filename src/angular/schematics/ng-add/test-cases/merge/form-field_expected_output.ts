import { Component } from '@angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbFormFieldControl } from '@sbb-esta/angular/form-field';

@Component({
  selector: 'test',
  template: `
    <sbb-form-field label="Test" class="sbb-form-field-flexible-errors">
      <input sbbInput>
    </sbb-form-field>
  `,
})
export class TestComponent {}

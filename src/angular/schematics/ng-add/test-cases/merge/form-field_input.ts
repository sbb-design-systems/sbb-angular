import { Component } from '@angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbFormFieldControl } from '@sbb-esta/angular-core/forms';

@Component({
  selector: 'test',
  template: `
    <sbb-form-field label="Test" class="sbb-form-field-errorless">
      <input sbbInput>
    </sbb-form-field>
  `,
})
export class TestComponent {}

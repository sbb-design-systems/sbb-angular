import { Component, NgModule } from '@angular/core';
import { FieldModule } from '@sbb-esta/angular-public/field';

@Component({
  selector: 'sbb-form-field-test',
  template: `
    <sbb-field
      label="Spacing"
      mode="short"
      >
      <input
       formControlName="spacing">
    </sbb-field
    >
    <sbb-field label="Test" mode="default">
      <input formControlName="test">
    </sbb-field>
    <sbb-field label="Test2" mode="long">
      <select formControlName="test2">
        <option>Value</option>
      </select>
    </sbb-field>
    <sbb-form-field [mode]="'medium'">
      <sbb-label for="id">Test3</sbb-label>
      <input sbbInput formControlName="test3">
    </sbb-form-field>
    <sbb-form-field [mode]="mode">
      <sbb-label [for]="id">Test4</sbb-label>
      <select formControlName="test" sbbInput>
        <option>Value</option>
      </select>
    </sbb-form-field>
    <sbb-form-field class="example" label="Test5" mode="long">
      <input formControlName="test5" sbbInput>
    </sbb-form-field>
    <sbb-form-field label="Test6" mode="short" class="example">
      <input formControlName="test6" sbbInput>
    </sbb-form-field>
  `
})
export class FormFieldTestComponent {}

@NgModule({
  declarations: [FormFieldTestComponent],
  imports: [FieldModule],
})
export class FormFieldTestModule {}
import { Component, NgModule } from '@angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';

@Component({
  selector: 'sbb-form-field-test',
  template: `
    <sbb-form-field class="sbb-form-field-short"
      label="Spacing"
     
      >
      <input sbbInput
       formControlName="spacing">
    </sbb-form-field
    >
    <sbb-form-field label="Test">
      <input sbbInput formControlName="test">
    </sbb-form-field>
    <sbb-form-field class="sbb-form-field-long" label="Test2">
      <select sbbInput formControlName="test2">
        <option>Value</option>
      </select>
    </sbb-form-field>
    <sbb-form-field class="sbb-form-field-medium">
      <sbb-label>Test3</sbb-label>
      <input sbbInput formControlName="test3">
    </sbb-form-field>
    <sbb-form-field [mode]="mode">
      <sbb-label>Test4</sbb-label>
      <select formControlName="test" sbbInput>
        <option>Value</option>
      </select>
    </sbb-form-field>
    <sbb-form-field class="example sbb-form-field-long" label="Test5">
      <input formControlName="test5" sbbInput>
    </sbb-form-field>
    <sbb-form-field label="Test6" class="example sbb-form-field-short">
      <input formControlName="test6" sbbInput>
    </sbb-form-field>
  `
})
export class FormFieldTestComponent {}

@NgModule({
  declarations: [FormFieldTestComponent],
  imports: [SbbFormFieldModule],
})
export class FormFieldTestModule {}
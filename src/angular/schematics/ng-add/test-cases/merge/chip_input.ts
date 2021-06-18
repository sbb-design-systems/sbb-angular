import { Component, NgModule, ViewChild } from '@angular/core';
import {
  SbbAutocompleteModule,
  SbbChipInput,
  SbbChipInputChange,
  SbbChipModule,
} from '@sbb-esta/angular-business';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  template: `
    <sbb-chip-input></sbb-chip-input>
    <ng-container [formGroup]="formGroup">
      <sbb-chip-input formControlName="formName"></sbb-chip-input>
      <sbb-chip-input formControlName="{{ formNameVar }}"></sbb-chip-input>
      <sbb-chip-input [formControlName]="formNameVar"></sbb-chip-input>
    </ng-container>
    <sbb-chip-input formControlName="formName"></sbb-chip-input>
    <sbb-chip-input formControlName="{{ formNameVar }}"></sbb-chip-input>
    <sbb-chip-input [formControlName]="formNameVar"></sbb-chip-input>
    <sbb-chip-input [formControl]="formControl"></sbb-chip-input>
    <sbb-chip-input
      name="email"
      #chipInput
      [disabled]="true"
      (valueChange)="filterChipInput($event)"
      [(ngModel)]="model"
      [required]="required()"
      [sbbAutocomplete]="auto"
    >
    </sbb-chip-input>
    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let option of options" [value]="option">{{ option }}</sbb-option>
    </sbb-autocomplete>
  `,
})
export class ChipTestComponent {
  @ViewChild('chipInput') chipInput: SbbChipInput;
  filterChipInput($event: SbbChipInputChange) {}

  options = [];
  model: string;
  formControl: FormControl;

  formGroup = this.formBuilder.group({
    formName: [[], Validators.required],
  });
  formNameVar: string;

  constructor(private formBuilder: FormBuilder) {}

  required() {
    return true;
  }
}

@NgModule({
  declarations: [ChipTestComponent],
  imports: [SbbChipModule, ReactiveFormsModule, SbbAutocompleteModule, FormsModule],
})
export class ChipTestModule {}

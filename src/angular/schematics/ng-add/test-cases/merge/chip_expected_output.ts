import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbChipList, SbbChipInputEvent, SbbChipsModule } from '@sbb-esta/angular/chips';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  template: `
    <sbb-chip-list><!-- TODO: To make this work, create a formControl or ngModel --><sbb-chip *ngFor="let element of formControl.value" [value]="element">{{ element }}</sbb-chip><input sbbChipInput /></sbb-chip-list>
    <ng-container [formGroup]="formGroup">
      <sbb-chip-list formControlName="formName"><sbb-chip *ngFor="let element of formGroup.get('formName').value" [value]="element">{{ element }}</sbb-chip><input sbbChipInput /></sbb-chip-list>
      <sbb-chip-list formControlName="{{ formNameVar }}"><sbb-chip *ngFor="let element of formGroup.get(formNameVar).value" [value]="element">{{ element }}</sbb-chip><input sbbChipInput /></sbb-chip-list>
      <sbb-chip-list [formControlName]="formNameVar"><sbb-chip *ngFor="let element of formGroup.get(formNameVar).value" [value]="element">{{ element }}</sbb-chip><input sbbChipInput /></sbb-chip-list>
    </ng-container>
    <sbb-chip-list formControlName="formName"><!-- TODO: Replace formGroup with your formGroup variable name --><sbb-chip *ngFor="let element of formGroup.get('formName').value" [value]="element">{{ element }}</sbb-chip><input sbbChipInput /></sbb-chip-list>
    <sbb-chip-list formControlName="{{ formNameVar }}"><!-- TODO: Replace formGroup with your formGroup variable name --><sbb-chip *ngFor="let element of formGroup.get(formNameVar).value" [value]="element">{{ element }}</sbb-chip><input sbbChipInput /></sbb-chip-list>
    <sbb-chip-list [formControlName]="formNameVar"><!-- TODO: Replace formGroup with your formGroup variable name --><sbb-chip *ngFor="let element of formGroup.get(formNameVar).value" [value]="element">{{ element }}</sbb-chip><input sbbChipInput /></sbb-chip-list>
    <sbb-chip-list [formControl]="formControl"><sbb-chip *ngFor="let element of formControl.value" [value]="element">{{ element }}</sbb-chip><input sbbChipInput /></sbb-chip-list>
    <sbb-chip-list
      name="email"
      #chipInput
      [disabled]="true"
      (valueChange)="filterChipInput($event)"
      [(ngModel)]="model"
      [required]="required()"
     
    ><sbb-chip *ngFor="let element of model" [value]="element">{{ element }}</sbb-chip><input sbbChipInput [sbbAutocomplete]="auto" />
    </sbb-chip-list>
    <sbb-autocomplete #auto="sbbAutocomplete">
      <sbb-option *ngFor="let option of options" [value]="option">{{ option }}</sbb-option>
    </sbb-autocomplete>
  `,
})
export class ChipTestComponent {
  @ViewChild('chipInput') chipInput: SbbChipList;
  filterChipInput($event: SbbChipInputEvent) {}

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
  imports: [SbbChipsModule, ReactiveFormsModule, SbbAutocompleteModule, FormsModule],
})
export class ChipTestModule {}

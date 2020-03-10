import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AutocompleteModule, FieldModule, FormErrorDirective } from '@sbb-esta/angular-business';
import { IconCrossModule } from '@sbb-esta/angular-icons';
import { configureTestSuite } from 'ng-bullet';

import { ChipComponent } from '../..';

import { ChipInputComponent } from './chip-input.component';

@Component({
  selector: 'sbb-test-chip-input',
  template: `
    <form [formGroup]="formGroup">
      <sbb-field label="Label" mode="long">
        <sbb-chip-input formControlName="chip" [sbbAutocomplete]="auto"></sbb-chip-input>
        <sbb-autocomplete #auto="sbbAutocomplete">
          <sbb-option *ngFor="let option of options" [value]="option">{{ option }}</sbb-option>
        </sbb-autocomplete>
        <sbb-form-error *ngIf="formGroup.get('chip')?.errors?.required">
          This field is required.
        </sbb-form-error>
      </sbb-field>
    </form>
  `
})
class ChipInputTestComponent implements OnInit {
  options = ['option-1', 'option-2'];
  formGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      chip: [['option-1'], Validators.required]
    });
  }
}

describe('ChipInputComponent', () => {
  let component: ChipInputTestComponent;
  let fixture: ComponentFixture<ChipInputTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ChipInputComponent, ChipComponent, ChipInputTestComponent],
      imports: [CommonModule, AutocompleteModule, IconCrossModule, ReactiveFormsModule, FieldModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipInputTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain one option chip through preselection', () => {
    fixture.whenStable().then(() => {
      const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
      expect(chipComponents.length).toBe(1);
    });
  });

  it('should contain two option chips using setValue', () => {
    component.formGroup.get('chip').setValue(['option-1', 'option-2']);
    fixture.detectChanges();

    const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
    expect(chipComponents.length).toBe(2);
  });

  it('should show error status when invalid', () => {
    component.formGroup.get('chip').setValue([]);
    fixture.detectChanges();

    const erroredWrapper = fixture.debugElement.query(By.css('sbb-chip-input-error'));
    const errorText = fixture.debugElement.query(By.directive(FormErrorDirective));
    expect(component.formGroup.get('chip').invalid).toBe(true);
    expect(erroredWrapper).toBeDefined();
    expect(errorText).toBeDefined();
  });

  it('should disable chip input and chips', () => {
    component.formGroup.get('chip').disable();
    const chipInputComponent = fixture.debugElement.query(By.directive(ChipInputComponent));
    const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
    fixture.detectChanges();

    chipComponents.forEach(chipComponent =>
      expect(chipComponent.classes['sbb-chip-disabled']).toBe(true)
    );
    expect(chipInputComponent.classes['sbb-chip-input-disabled']).toBe(true);
  });
});

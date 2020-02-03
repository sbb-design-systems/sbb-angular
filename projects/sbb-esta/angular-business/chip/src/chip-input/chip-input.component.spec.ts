import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AutocompleteModule, FieldModule, FormErrorDirective } from '@sbb-esta/angular-business';
import { IconCrossModule } from '@sbb-esta/angular-icons';
import { configureTestSuite } from 'ng-bullet';

import { ContextmenuComponent } from '../../../contextmenu';
import { ChipComponent } from '../chip/chip.component';

import { ChipInputComponent } from './chip-input.component';

@Component({
  selector: 'sbb-test-chip-input',
  template: `
    <form [formGroup]="formGroup">
      <sbb-field label="Label" class="sbb-field-100">
        <sbb-chip-input formControlName="chip" [options]="options"></sbb-chip-input>
        <sbb-form-error *ngIf="formGroup.get('chip').errors?.required">
          This field is required.
        </sbb-form-error>
      </sbb-field>
    </form>
  `
})
class ChipInputTestComponent implements OnInit {
  options = ['option-1', 'option-2'];
  formGroup: FormGroup;
  chipControl = [['option-1'], Validators.required];

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      chip: this.chipControl
    });
  }
}

describe('ContextmenuComponent', () => {
  let component: ChipInputTestComponent;
  let fixture: ComponentFixture<ChipInputTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ChipInputComponent, ChipComponent, ChipInputTestComponent],
      imports: [
        CommonModule,
        FormsModule,
        AutocompleteModule,
        IconCrossModule,
        ReactiveFormsModule,
        FieldModule
      ]
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
    const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));

    expect(chipComponents.length).toBe(1);
  });

  it('should contain two option chips using setValue', () => {
    component.formGroup.get('chip').setValue(['option-1', 'option-2']);
    fixture.detectChanges();

    const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
    expect(chipComponents.length).toBe(2);
  });

  it('should not contain any option chips using setValue with unavailable value', () => {
    const warnSpy = spyOn(console, 'warn');
    component.formGroup.get('chip').setValue(['test']);
    fixture.detectChanges();

    const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(chipComponents.length).toBe(0);
  });

  it('should show error status when invalid', () => {
    component.formGroup.get('chip').setValue(['test']);
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
    expect(chipInputComponent.properties.disabled).toBe(true);
  });
});

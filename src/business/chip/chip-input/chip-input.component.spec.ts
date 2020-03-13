import { ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AutocompleteModule, FieldModule, FormErrorDirective } from '@sbb-esta/angular-business';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchMouseEvent,
  typeInElement
} from '@sbb-esta/angular-core/testing';
import { IconCrossModule } from '@sbb-esta/angular-icons';

import { ChipComponent } from '../..';

import { ChipInputComponent } from './chip-input.component';

@Component({
  selector: 'sbb-test-reactive-chip-input',
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
class ChipInputReactiveFormsTestComponent {
  options = ['option-1', 'option-2'];
  formGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.formGroup = this._formBuilder.group({
      chip: [['option-1'], Validators.required]
    });
  }
}

@Component({
  selector: 'sbb-test-forms-chip-input',
  template: `
    <sbb-field label="Label">
      <sbb-chip-input
        [(ngModel)]="value"
        [required]="true"
        [disabled]="disabled"
        #input="ngModel"
      ></sbb-chip-input>
      <sbb-form-error *ngIf="input.invalid && (input.dirty || input.touched)"
        >This field is required.</sbb-form-error
      >
    </sbb-field>
  `
})
class ChipInputFormsTestComponent {
  value: string[] = [];

  @ViewChild('input')
  inputModel: NgModel;

  @ViewChild(ChipInputComponent)
  chipInput: ChipInputComponent;

  disabled = false;
}

describe('ChipInputComponent', () => {
  describe('reactive forms', () => {
    let component: ChipInputReactiveFormsTestComponent;
    let fixture: ComponentFixture<ChipInputReactiveFormsTestComponent>;
    let inputElement: HTMLInputElement;

    configureTestSuite(() => {
      TestBed.configureTestingModule({
        declarations: [ChipInputComponent, ChipComponent, ChipInputReactiveFormsTestComponent],
        imports: [
          CommonModule,
          AutocompleteModule,
          IconCrossModule,
          ReactiveFormsModule,
          FieldModule
        ]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ChipInputReactiveFormsTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.css('input.sbb-chip-input-textfield'))
        .nativeElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain one option chip through preselection', done => {
      fixture.whenStable().then(() => {
        const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
        expect(chipComponents.length).toBe(1);
        done();
      });
    });

    it('should contain two option chips using setValue', () => {
      component.formGroup.get('chip').setValue(['option-1', 'option-2']);
      fixture.detectChanges();

      const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
      expect(chipComponents.length).toBe(2);
    });

    it('should hide form error if invalid but untouched', () => {
      component.formGroup.get('chip').setValue([]);
      fixture.detectChanges();

      const errorText = fixture.debugElement.query(By.directive(FormErrorDirective));
      expect(component.formGroup.get('chip').invalid).toBe(true);
      expect(errorText).toBeFalsy();
    });

    it('should display form error when input was touched', () => {
      component.formGroup.get('chip').setValue([]);
      fixture.detectChanges();

      inputElement.focus();

      fixture.detectChanges();
      expect(fixture.debugElement.query(By.directive(FormErrorDirective))).toBeFalsy();
      dispatchFakeEvent(inputElement, 'blur');

      fixture.detectChanges();
      expect(fixture.debugElement.query(By.directive(FormErrorDirective))).toBeTruthy();
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

    it('should forward focus when clicking sbb-field label', () => {
      const label = fixture.debugElement.query(By.css('label'));
      spyOn(inputElement, 'focus');

      expect(inputElement.focus).not.toHaveBeenCalled();
      dispatchMouseEvent(label.nativeElement, 'click');
      fixture.detectChanges();

      expect(inputElement.focus).toHaveBeenCalled();
    });

    it('should correctly update chip value by using keyboard', () => {
      expect(component.formGroup.get('chip').value).toEqual(['option-1']);

      inputElement.focus();
      typeInElement(inputElement, 'option-2');
      dispatchEvent(inputElement, createKeyboardEvent('keydown', ENTER, 'Enter', inputElement));

      fixture.detectChanges();

      expect(component.formGroup.get('chip').value).toEqual(['option-1', 'option-2']);
    });
  });

  describe('forms', () => {
    let component: ChipInputFormsTestComponent;
    let fixture: ComponentFixture<ChipInputFormsTestComponent>;
    let inputElement: HTMLInputElement;

    configureTestSuite(() => {
      TestBed.configureTestingModule({
        declarations: [ChipInputComponent, ChipComponent, ChipInputFormsTestComponent],
        imports: [CommonModule, AutocompleteModule, IconCrossModule, FormsModule, FieldModule]
      });
    });

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ChipInputFormsTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      flush();
      inputElement = fixture.debugElement.query(By.css('input.sbb-chip-input-textfield'))
        .nativeElement;
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain one option chip through preselection', fakeAsync(done => {
      component.value = ['option-1'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
      expect(chipComponents.length).toBe(1);
    }));

    it('should contain two option chips', fakeAsync(() => {
      component.value = ['option-1', 'option-2'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
      expect(chipComponents.length).toBe(2);
    }));

    it('should hide form error if invalid but untouched', () => {
      const errorText = fixture.debugElement.query(By.directive(FormErrorDirective));
      expect(component.inputModel.invalid).toBe(true);
      expect(errorText).toBeFalsy();
    });

    it('should display form error when input was touched', () => {
      inputElement.focus();

      fixture.detectChanges();
      expect(fixture.debugElement.query(By.directive(FormErrorDirective))).toBeFalsy();
      dispatchFakeEvent(inputElement, 'blur');

      fixture.detectChanges();
      expect(fixture.debugElement.query(By.directive(FormErrorDirective))).toBeTruthy();
    });

    it('should disable chip input and chips', () => {
      component.disabled = true;
      const chipInputComponent = fixture.debugElement.query(By.directive(ChipInputComponent));
      const chipComponents = fixture.debugElement.queryAll(By.directive(ChipComponent));
      fixture.detectChanges();

      chipComponents.forEach(chipComponent =>
        expect(chipComponent.classes['sbb-chip-disabled']).toBe(true)
      );
      expect(chipInputComponent.classes['sbb-chip-input-disabled']).toBe(true);
    });

    it('should forward focus when clicking sbb-field label', () => {
      const label = fixture.debugElement.query(By.css('label'));
      spyOn(inputElement, 'focus');

      expect(inputElement.focus).not.toHaveBeenCalled();
      dispatchMouseEvent(label.nativeElement, 'click');
      fixture.detectChanges();

      expect(inputElement.focus).toHaveBeenCalled();
    });

    it('should correctly update chip value by using keyboard', fakeAsync(() => {
      component.value = ['option-1'];
      fixture.detectChanges();
      flush();

      expect(component.value).toEqual(['option-1']);
      expect(component.inputModel.value).toEqual(['option-1']);
      expect(component.chipInput.value).toEqual(['option-1']);

      inputElement.focus();
      typeInElement(inputElement, 'option-2');
      dispatchEvent(inputElement, createKeyboardEvent('keydown', ENTER, 'Enter', inputElement));

      fixture.detectChanges();
      expect(component.value).toEqual(['option-1', 'option-2']);
      expect(component.inputModel.value).toEqual(['option-1', 'option-2']);
      expect(component.chipInput.value).toEqual(['option-1', 'option-2']);
    }));

    it('should correctly set value using interface of ChipInputComponent', fakeAsync(() => {
      expect(component.value).toEqual([]);
      expect(component.inputModel.value).toEqual([]);
      expect(component.chipInput.value).toEqual([]);

      component.chipInput.value = ['option-1'];

      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value).toEqual(['option-1']);
      expect(component.inputModel.value).toEqual(['option-1']);
      expect(component.chipInput.value).toEqual(['option-1']);
    }));
  });
});

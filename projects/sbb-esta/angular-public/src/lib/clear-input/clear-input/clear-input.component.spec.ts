import { configureTestSuite } from 'ng-bullet';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DatepickerModule } from '../../datepicker/datepicker';
import { SearchModule } from '../../search/search';
import { ClearInputModule } from '../clear-input.module';

import { ClearInputComponent } from './clear-input.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-clear-input-test',
  template: `
    <input
      [(ngModel)]="testValue"
      [disabled]="inputDisabled"
      sbbClearTarget
      #target="sbbClearTarget"
    />

    <sbb-clear-input [resetValue]="resetValue" [target]="target" [mode]="mode"> </sbb-clear-input>
  `
})
class ClearInputTestComponent {
  testValue = 'test';
  resetValue = '';
  mode = 'auto';
  inputDisabled = false;
}

describe('ClearInputComponent', () => {
  let component: ClearInputTestComponent;
  let fixture: ComponentFixture<ClearInputTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ClearInputModule],
      declarations: [ClearInputTestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearInputTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear target value when clicked', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    expect(component.testValue).toBe('test');
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(component.testValue).toBe('');
  });

  it('should set target value to resetValue when clicked', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    component.resetValue = 'abc';
    fixture.detectChanges();
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(component.testValue).toBe('abc');
  });

  it('should be hidden if target is empty and mode is auto', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    component.testValue = '';
    component.mode = 'auto';
    fixture.detectChanges();
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(clearInput.nativeElement.hasAttribute('hidden')).toBeTruthy();
  });

  it('should NOT be hidden if target is empty and mode is fixed', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    component.testValue = '';
    component.mode = 'fixed';
    fixture.detectChanges();
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(clearInput.nativeElement.hasAttribute('hidden')).toBeFalsy();
  });
});

@Component({
  selector: 'sbb-clear-input-disabled-test',
  template: `
    <input [(ngModel)]="testValue" disabled="true" sbbClearTarget #target="sbbClearTarget" />
    <sbb-clear-input [target]="target"> </sbb-clear-input>
  `
})
class ClearInputDisabledTestComponent {
  testValue = 'test';
  inputDisabled = false;
}

describe('ClearInputComponent with input disabled', () => {
  let component: ClearInputDisabledTestComponent;
  let fixture: ComponentFixture<ClearInputDisabledTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ClearInputModule],
      declarations: [ClearInputDisabledTestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearInputDisabledTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear target value when clicked', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    expect(component.testValue).toBe('test');
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(component.testValue).toBe('');
  });
});

@Component({
  selector: 'sbb-clear-input-test-reactive',
  template: `
    <form [formGroup]="form">
      <input formControlName="testValue" sbbClearTarget #target="sbbClearTarget" />

      <sbb-clear-input [target]="target" [mode]="mode"> </sbb-clear-input>
    </form>
  `
})
class ClearInputReactiveTestComponent implements OnInit {
  form: FormGroup;
  mode = 'auto';
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      testValue: ['test']
    });
  }
}

describe('ClearInputComponent with Reactive Forms', () => {
  let component: ClearInputReactiveTestComponent;
  let fixture: ComponentFixture<ClearInputReactiveTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, ClearInputModule],
      declarations: [ClearInputReactiveTestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearInputReactiveTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear target value when clicked', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    expect(component.form.get('testValue').value).toBe('test');
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(component.form.get('testValue').value).toBe('');
  });
});

@Component({
  selector: 'sbb-clear-input-test-date',
  template: `
    <sbb-datepicker>
      <input [(ngModel)]="testValue" sbbClearTarget #target="sbbClearTarget" />
    </sbb-datepicker>

    <sbb-clear-input [resetValue]="resetValue" [target]="target" [mode]="mode"> </sbb-clear-input>
  `
})
class ClearInputSbbDateTestComponent {
  form: FormGroup;
  resetValue = '';
  testValue: any;
  mode = 'auto';
}

describe('ClearInputComponent with sbb-datepicker', () => {
  let component: ClearInputSbbDateTestComponent;
  let fixture: ComponentFixture<ClearInputSbbDateTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, DatepickerModule, ClearInputModule],
      declarations: [ClearInputSbbDateTestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearInputSbbDateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear target value when clicked', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(component.testValue).toBe('');
  });

  it('should set target value to resetValue when clicked', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    component.resetValue = 'aaa';
    fixture.detectChanges();
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(component.testValue).toBe('aaa');
  });
});

@Component({
  selector: 'sbb-clear-input-test-search',
  template: `
    <sbb-search>
      <input [(ngModel)]="testValue" sbbClearTarget #target="sbbClearTarget" />
    </sbb-search>

    <sbb-clear-input [target]="target" [mode]="mode"> </sbb-clear-input>
  `
})
class ClearInputSbbSearchTestComponent {
  form: FormGroup;
  testValue = 'test';
  mode = 'auto';
}

describe('ClearInputComponent with sbb-search', () => {
  let component: ClearInputSbbSearchTestComponent;
  let fixture: ComponentFixture<ClearInputSbbSearchTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, SearchModule, ClearInputModule, BrowserAnimationsModule],
      declarations: [ClearInputSbbSearchTestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearInputSbbSearchTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear target value when clicked', () => {
    const clearInput = fixture.debugElement.query(By.directive(ClearInputComponent));
    expect(component.testValue).toBe('test');
    clearInput.nativeElement.click();

    fixture.detectChanges();
    expect(component.testValue).toBe('');
  });
});

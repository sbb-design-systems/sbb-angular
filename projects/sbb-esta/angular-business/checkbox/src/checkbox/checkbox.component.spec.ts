import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { dispatchMouseEvent } from '@sbb-esta/angular-core/testing';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { configureTestSuite } from 'ng-bullet';

import { CheckboxComponent } from './checkbox.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-model-checkbox-test',
  template: `
    <sbb-checkbox
      [checked]="checked"
      [indeterminate]="indeterminate"
      inputId="test-check-1"
      value="1"
      #check1
      >Test check 1</sbb-checkbox
    >
  `
})
class ModelCheckboxTestComponent {
  checked = false;
  indeterminate = false;

  @ViewChild('check1')
  checkboxComponent: CheckboxComponent;
}

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, IconCollectionModule],
      declarations: [CheckboxComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a generated id if not provided', () => {
    expect(component.inputId).toContain('sbb-checkbox-');
  });
});

describe('CheckboxComponent using mock component', () => {
  let modelComponent: ModelCheckboxTestComponent;
  let modelComponentFixture: ComponentFixture<ModelCheckboxTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, IconCollectionModule],
      declarations: [CheckboxComponent, ModelCheckboxTestComponent]
    });
  });

  beforeEach(() => {
    modelComponentFixture = TestBed.createComponent(ModelCheckboxTestComponent);
    modelComponent = modelComponentFixture.componentInstance;

    modelComponentFixture.detectChanges();
  });

  it('should create', () => {
    expect(modelComponent).toBeTruthy();
  });

  it('should have sbb-checkbox class', () => {
    const checkboxComp = modelComponentFixture.debugElement.query(By.css('.sbb-checkbox'));
    expect(checkboxComp).toBeTruthy();
  });

  it('should not have class for indeterminate', () => {
    const checkboxComponentIndeterminate = modelComponentFixture.debugElement.query(
      By.css('.sbb-checkbox-indeterminate')
    );
    expect(checkboxComponentIndeterminate).not.toBeTruthy();
  });

  it('should have class for indeterminate if indeterminate', async () => {
    modelComponent.indeterminate = true;

    modelComponentFixture.detectChanges();
    await modelComponentFixture.whenStable();

    const checkboxComponentIndeterminate = modelComponentFixture.debugElement.query(
      By.css('.sbb-checkbox-indeterminate')
    );
    expect(checkboxComponentIndeterminate).toBeTruthy();
  });

  it('should have class for indeterminate if indeterminate and checked', async () => {
    modelComponent.checked = true;
    modelComponent.indeterminate = true;

    modelComponentFixture.detectChanges();
    await modelComponentFixture.whenStable();

    const checkboxComponentIndeterminate = modelComponentFixture.debugElement.query(
      By.css('.sbb-checkbox-indeterminate')
    );
    expect(checkboxComponentIndeterminate).toBeTruthy();
  });

  /* TODO: Test broken. Needs investigation.
  it('should not show tick if indeterminate and checked', async () => {
    modelComponent.indeterminate = true;

    modelComponentFixture.detectChanges();
    await modelComponentFixture.whenStable();

    const checkboxChecked = modelComponentFixture.debugElement.query(
      By.css('.sbb-checkbox-checked')
    );
    expect(getComputedStyle(checkboxChecked.nativeElement).getPropertyValue('display')).toBe(
      'none'
    );
  });
  */

  it('should change from unchecked and indeterminate to checked on click', async () => {
    modelComponent.checked = false;
    modelComponent.indeterminate = true;

    modelComponentFixture.detectChanges();
    await modelComponentFixture.whenStable();

    const labelElement = modelComponentFixture.debugElement.query(By.css('label'))
      .nativeElement as HTMLLabelElement;

    dispatchMouseEvent(labelElement, 'click');

    modelComponentFixture.detectChanges();
    await modelComponentFixture.whenStable();

    const inputElement = modelComponentFixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;
    expect(modelComponent.checkboxComponent.indeterminate).toBe(false);
    expect(inputElement.checked).toBe(true);
  });

  it('should change checked to unchecked on click', async () => {
    modelComponent.checked = true;

    modelComponentFixture.detectChanges();
    await modelComponentFixture.whenStable();

    const inputElement = modelComponentFixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;
    dispatchMouseEvent(inputElement, 'click');

    modelComponentFixture.detectChanges();
    await modelComponentFixture.whenStable();

    expect(inputElement.checked).toBe(false);
  });
});

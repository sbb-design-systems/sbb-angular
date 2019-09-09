import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { createFakeEvent } from '@sbb-esta/angular-core/testing';
import { configureTestSuite } from 'ng-bullet';

import { RadioButtonPanelModule } from '../radio-button-panel.module';

import { RadioButtonPanelComponent } from './radio-button-panel.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-model-radio-button-panel-test',
  template: `
    <sbb-radio-button-panel
      [(ngModel)]="testValue"
      inputId="test-option-1"
      name="test-option"
      value="1"
    >
      Test option selection 1
    </sbb-radio-button-panel>
    <sbb-radio-button-panel
      [(ngModel)]="testValue"
      inputId="test-option-2"
      name="test-option"
      value="2"
    >
      Test option selection 2
    </sbb-radio-button-panel>
  `
})
class ModelOptionSelectionTestComponent {
  testValue = '2';
  @ViewChildren(RadioButtonPanelComponent) optionSelections: QueryList<RadioButtonPanelComponent>;
}

describe('RadioButtonPanelComponent', () => {
  let component: RadioButtonPanelComponent;
  let fixture: ComponentFixture<RadioButtonPanelComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RadioButtonPanelModule],
      declarations: [ModelOptionSelectionTestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a generated id if not provided', () => {
    expect(component.inputId).toMatch(/sbb-radio-button-panel-\d+/);
  });
});

describe('RadioButtonPanelComponent using mock component', () => {
  let modelComponent: ModelOptionSelectionTestComponent;
  let modelComponentFixture: ComponentFixture<ModelOptionSelectionTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RadioButtonPanelModule],
      declarations: [ModelOptionSelectionTestComponent]
    });
  });

  beforeEach(() => {
    modelComponentFixture = TestBed.createComponent(ModelOptionSelectionTestComponent);
    modelComponent = modelComponentFixture.componentInstance;

    modelComponentFixture.detectChanges();
  });

  it('should create', () => {
    expect(modelComponent).toBeTruthy();
  });

  it('should create mock component and should contain two sbb-radio-button-panel components', () => {
    expect(modelComponent).toBeTruthy();

    const optionSelectionComponents = modelComponentFixture.debugElement.queryAll(
      By.directive(RadioButtonPanelComponent)
    );
    expect(optionSelectionComponents).toBeTruthy();
    expect(optionSelectionComponents.length).toBe(2);
  });

  it('should be mutual exclusive', async () => {
    const opt1: RadioButtonPanelComponent = modelComponent.optionSelections.toArray()[0];
    const opt2: RadioButtonPanelComponent = modelComponent.optionSelections.toArray()[1];

    await modelComponentFixture.whenRenderingDone();

    opt1.click(createFakeEvent('click'));
    modelComponentFixture.detectChanges();

    let checkedComponents = modelComponent.optionSelections.filter(o => o.checked === true);
    expect(checkedComponents.length).toBe(1);

    opt2.click(createFakeEvent('click'));
    modelComponentFixture.detectChanges();

    checkedComponents = modelComponent.optionSelections.filter(o => o.checked === true);
    expect(checkedComponents.length).toBe(1);
  });

  it('should checked if model is equal to value', async () => {
    const opt1: RadioButtonPanelComponent = modelComponent.optionSelections.toArray()[0];
    const opt2: RadioButtonPanelComponent = modelComponent.optionSelections.toArray()[1];

    modelComponent.testValue = '1';
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();

    expect(opt1.checked).toBe(true);

    opt2.click(createFakeEvent('click'));
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();
    expect(opt2.checked).toBe(true);
    expect(modelComponent.testValue).toBe(opt2.value);
  });
});

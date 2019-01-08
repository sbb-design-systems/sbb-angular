import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSelectionComponent } from './option-selection.component';
import { OptionSelectionModule } from '../option-selection.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { RadioButton } from '../../radio-button/radio-button/radio-button.model';
import { RadioButtonModule } from '../../radio-button/radio-button';
import { dispatchMouseEvent } from '../../_common/testing/dispatch-events';
import { createFakeEvent } from '../../_common/testing/event-objects';

@Component({
  selector: 'sbb-model-option-selection-test',
  template: `
  <sbb-option-selection
    [(ngModel)]="testValue"
    inputId="test-option-1"
    name="test-option"
    value="1">
    Test option selection 1
  </sbb-option-selection>
  <sbb-option-selection
    [(ngModel)]="testValue"
    inputId="test-option-2"
    name="test-option"
    value="2">
    Test option selection 2
  </sbb-option-selection>
  `
})
class ModelOptionSelectionTestComponent {
  testValue = '2';
  @ViewChildren(OptionSelectionComponent) optionSelections: QueryList<OptionSelectionComponent>;
}



describe('OptionSelectionComponent', () => {
  let component: OptionSelectionComponent;
  let fixture: ComponentFixture<OptionSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, OptionSelectionModule],
      declarations: [ModelOptionSelectionTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a generated id if not provided', () => {
    expect(component.inputId).toBe('sbb-option-selection-1');
  });
});

describe('OptionSelectionComponent using mock component', () => {
  let modelComponent: ModelOptionSelectionTestComponent;
  let modelComponentFixture: ComponentFixture<ModelOptionSelectionTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, OptionSelectionModule],
      declarations: [ModelOptionSelectionTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    modelComponentFixture = TestBed.createComponent(ModelOptionSelectionTestComponent);
    modelComponent = modelComponentFixture.componentInstance;

    modelComponentFixture.detectChanges();
  });

  it('should create', () => {
    expect(modelComponent).toBeTruthy();
  });

  it('should create mock component and should contain two sbb-option-selection components', () => {
    expect(modelComponent).toBeTruthy();

    const optionSelectionComponents = modelComponentFixture.debugElement.queryAll(By.directive(OptionSelectionComponent));
    expect(optionSelectionComponents).toBeTruthy();
    expect(optionSelectionComponents.length).toBe(2);
  });

  it('should be mutual exclusive', async() => {
    const opt1: OptionSelectionComponent = modelComponent.optionSelections.toArray()[0];
    const opt2: OptionSelectionComponent = modelComponent.optionSelections.toArray()[1];

    await modelComponentFixture.whenRenderingDone();

    opt1.click(createFakeEvent('click'));
    modelComponentFixture.detectChanges();

    let checkedComponents = modelComponent.optionSelections.filter( o => o.checked === true);
    expect(checkedComponents.length).toBe(1);

    opt2.click(createFakeEvent('click'));
    modelComponentFixture.detectChanges();

    checkedComponents = modelComponent.optionSelections.filter( o => o.checked === true);
    expect(checkedComponents.length).toBe(1);
  });

  it('should checked if model is equal to value', async() => {
    const opt1: OptionSelectionComponent = modelComponent.optionSelections.toArray()[0];
    const opt2: OptionSelectionComponent = modelComponent.optionSelections.toArray()[1];

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


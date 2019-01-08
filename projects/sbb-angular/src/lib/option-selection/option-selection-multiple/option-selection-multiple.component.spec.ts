import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSelectionMultipleComponent } from './option-selection-multiple.component';
import { OptionSelectionModule } from '../option-selection.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'sbb-model-option-selection-test',
  template: `
  <sbb-option-selection-multiple
    [(ngModel)]="checkValue1"
    inputId="test-option-1"
    name="test-option"
    value="1">
    Test option selection 1
  </sbb-option-selection-multiple>
  <sbb-option-selection-multiple
    [(ngModel)]="checkValue2"
    inputId="test-option-2"
    name="test-option"
    value="2">
    Test option selection 2
  </sbb-option-selection-multiple>
  `
})
class ModelOptionSelectionMultipleTestComponent {
  checkValue1 = false;
  checkValue2 = false;
  @ViewChildren(OptionSelectionMultipleComponent) optionSelections: QueryList<OptionSelectionMultipleComponent>;
}



describe('OptionSelectionMultipleComponent', () => {
  let component: OptionSelectionMultipleComponent;
  let fixture: ComponentFixture<OptionSelectionMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, OptionSelectionModule],
      declarations: [ModelOptionSelectionMultipleTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionSelectionMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a generated id if not provided', () => {
    expect(component.inputId).toBe('sbb-option-selection-multiple-1');
  });
});

describe('OptionSelectionComponent using mock component', () => {
  let modelComponent: ModelOptionSelectionMultipleTestComponent;
  let modelComponentFixture: ComponentFixture<ModelOptionSelectionMultipleTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, OptionSelectionModule],
      declarations: [ModelOptionSelectionMultipleTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    modelComponentFixture = TestBed.createComponent(ModelOptionSelectionMultipleTestComponent);
    modelComponent = modelComponentFixture.componentInstance;

    modelComponentFixture.detectChanges();
  });

  it('should create', () => {
    expect(modelComponent).toBeTruthy();
  });

  it('should create mock component and should contain two sbb-option-selection components', () => {
    expect(modelComponent).toBeTruthy();

    const optionSelectionComponents = modelComponentFixture.debugElement.queryAll(By.directive(OptionSelectionMultipleComponent));
    expect(optionSelectionComponents).toBeTruthy();
    expect(optionSelectionComponents.length).toBe(2);
  });

  it('should not be mutual exclusive', async () => {
    const opt1: OptionSelectionMultipleComponent = modelComponent.optionSelections.toArray()[0];
    const opt2: OptionSelectionMultipleComponent = modelComponent.optionSelections.toArray()[1];

    await modelComponentFixture.whenRenderingDone();

    opt1.click();
    modelComponentFixture.detectChanges();

    let checkedComponents = modelComponent.optionSelections.filter(o => !!o.checked);
    expect(checkedComponents.length).toBe(1);

    opt2.click();
    modelComponentFixture.detectChanges();

    checkedComponents = modelComponent.optionSelections.filter(o => !!o.checked);
    expect(checkedComponents.length).toBe(2);
  });

  it('should checked if model is true', async () => {
    const opt1: OptionSelectionMultipleComponent = modelComponent.optionSelections.toArray()[0];
    const opt2: OptionSelectionMultipleComponent = modelComponent.optionSelections.toArray()[1];

    modelComponent.checkValue1 = true;
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();

    expect(opt1.checked).toBe(true);
    expect(modelComponent.checkValue1).toBe(true);

    opt2.click();
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();
    expect(opt2.checked).toBe(true);
    expect(modelComponent.checkValue2).toBe(true);
  });
});


import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ɵRadioButtonModule } from '@sbb-esta/angular-core/radio-button';

import { RadioButtonPanelModule } from '../radio-button-panel.module';

import { RadioButtonPanelComponent } from './radio-button-panel.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-model-radio-button-panel-test',
  template: `
    <sbb-radio-group [(ngModel)]="testValue">
      <sbb-radio-button-panel value="1">
        Test option selection 1
      </sbb-radio-button-panel>
      <sbb-radio-button-panel value="2">
        Test option selection 2
      </sbb-radio-button-panel>
    </sbb-radio-group>
  `
})
class ModelOptionSelectionTestComponent {
  testValue = '2';
  @ViewChildren(RadioButtonPanelComponent) optionSelections: QueryList<RadioButtonPanelComponent>;
}

describe('RadioButtonPanelComponent', () => {
  let component: RadioButtonPanelComponent;
  let fixture: ComponentFixture<RadioButtonPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RadioButtonPanelModule],
      declarations: [ModelOptionSelectionTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a generated id if not provided', () => {
    expect(component.inputId).toMatch(/sbb-radio-button-\d+-input/);
  });
});

describe('RadioButtonPanelComponent using mock component', () => {
  let modelComponent: ModelOptionSelectionTestComponent;
  let modelComponentFixture: ComponentFixture<ModelOptionSelectionTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RadioButtonPanelModule, ɵRadioButtonModule],
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

  it('should create mock component and should contain two sbb-radio-button-panel components', () => {
    expect(modelComponent).toBeTruthy();

    const optionSelectionComponents = modelComponentFixture.debugElement.queryAll(
      By.directive(RadioButtonPanelComponent)
    );
    expect(optionSelectionComponents).toBeTruthy();
    expect(optionSelectionComponents.length).toBe(2);
  });

  it('should be mutual exclusive', async () => {
    const [label1, label2] = modelComponentFixture.debugElement.queryAll(By.css('label'));
    await modelComponentFixture.whenRenderingDone();

    label1.nativeElement.click();
    modelComponentFixture.detectChanges();

    let checkedComponents = modelComponent.optionSelections.filter(o => o.checked === true);
    expect(checkedComponents.length).toBe(1);

    label2.nativeElement.click();
    modelComponentFixture.detectChanges();

    checkedComponents = modelComponent.optionSelections.filter(o => o.checked === true);
    expect(checkedComponents.length).toBe(1);
  });

  it('should checked if model is equal to value', async () => {
    const [opt1, opt2] = modelComponent.optionSelections.toArray();

    modelComponent.testValue = '1';
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();

    expect(opt1.checked).toBe(true);

    const opt2Element = modelComponentFixture.debugElement.queryAll(By.css('label'))[1];
    opt2Element.nativeElement.click();
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();
    expect(opt2.checked).toBe(true);
    expect(modelComponent.testValue).toBe(opt2.value);
  });
});

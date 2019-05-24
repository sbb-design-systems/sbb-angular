import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

import { RadioButtonRegistryService } from './radio-button-registry.service';
import { RadioButtonComponent } from './radio-button.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-model-radio-button-test',
  template: `
    <sbb-radio-button
      [(ngModel)]="testValue"
      inputId="test-radio-1"
      name="test-radio"
      value="1"
    >
      Test radio button 1
    </sbb-radio-button>
    <sbb-radio-button
      [(ngModel)]="testValue"
      inputId="test-radio-2"
      name="test-radio"
      value="2"
    >
      Test radio button 2
    </sbb-radio-button>
  `
})
class ModelRadioButtonTestComponent {
  testValue = '2';
}

describe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [RadioButtonComponent],
      providers: [RadioButtonRegistryService]
    }).overrideComponent(RadioButtonComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a generated id if not provided', () => {
    expect(component.inputId).toContain('sbb-radio-button-');
  });
});

describe('RadioButtonComponent using mock component', () => {
  let modelComponent: ModelRadioButtonTestComponent;
  let modelComponentFixture: ComponentFixture<ModelRadioButtonTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [RadioButtonComponent, ModelRadioButtonTestComponent],
      providers: [RadioButtonRegistryService]
    }).overrideComponent(RadioButtonComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    });
  });

  beforeEach(() => {
    modelComponentFixture = TestBed.createComponent(
      ModelRadioButtonTestComponent
    );
    modelComponent = modelComponentFixture.componentInstance;

    modelComponentFixture.detectChanges();
  });

  it('should create', () => {
    expect(modelComponent).toBeTruthy();
  });

  it('should create mock component and should contain two sbb-radio-button components', () => {
    expect(modelComponent).toBeTruthy();

    const radiobuttonComponents = modelComponentFixture.debugElement.queryAll(
      By.directive(RadioButtonComponent)
    );
    expect(radiobuttonComponents).toBeTruthy();
    expect(radiobuttonComponents.length).toBe(2);
  });

  it('should check the radio button when click the label', () => {
    const radiobuttonLabel = modelComponentFixture.debugElement.query(
      By.css('label[for="test-radio-1"]')
    );
    expect(radiobuttonLabel).toBeTruthy();

    radiobuttonLabel.nativeElement.click();

    const radioButtonComponent = modelComponentFixture.debugElement.query(
      By.directive(RadioButtonComponent)
    );
    expect(radioButtonComponent).toBeTruthy();

    const radioButtonChecked = radioButtonComponent.queryAll(
      By.css('input:checked')
    );
    expect(radioButtonChecked).toBeTruthy();
    expect(radioButtonChecked.length).toBe(1);
  });

  it('should be mutual exclusive', () => {
    const radioButtons = modelComponentFixture.debugElement.queryAll(
      By.directive(RadioButtonComponent)
    );
    radioButtons[0].query(By.css('input[type="radio"]')).nativeElement.click();

    let radioButtonChecked = modelComponentFixture.debugElement.queryAll(
      By.css('input:checked')
    );
    expect(radioButtonChecked.length).toBe(1);

    radioButtons[1].query(By.css('input[type="radio"]')).nativeElement.click();

    radioButtonChecked = modelComponentFixture.debugElement.queryAll(
      By.css('input:checked')
    );
    expect(radioButtonChecked.length).toBe(1);
  });

  it('should checked if model is equal to value', async () => {
    const radiobuttonLabel = modelComponentFixture.debugElement.query(
      By.css('label[for="test-radio-1"]')
    );
    expect(radiobuttonLabel).toBeTruthy();

    modelComponent.testValue = '1';
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();

    const components = modelComponentFixture.debugElement.queryAll(
      By.directive(RadioButtonComponent)
    );
    expect(components[0].componentInstance._checked).toBe(true);

    const radiobuttonLabel2 = modelComponentFixture.debugElement.query(
      By.css('label[for="test-radio-2"]')
    );
    expect(radiobuttonLabel2).toBeTruthy();

    radiobuttonLabel2.nativeElement.click();
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();
    expect(components[1].componentInstance._checked).toBe(true);
    expect(modelComponent.testValue).toBe(
      components[1].componentInstance.value
    );
  });
});

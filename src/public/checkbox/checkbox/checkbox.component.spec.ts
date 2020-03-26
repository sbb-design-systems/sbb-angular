import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import { CheckboxComponent } from './checkbox.component';

// tslint:disable:i18n
@Component({
  selector: 'sbb-model-checkbox-test',
  template: `
    <sbb-checkbox [(ngModel)]="checkValue1" inputId="test-check-1" value="1"
      >Test check 1</sbb-checkbox
    >
    <sbb-checkbox [(ngModel)]="checkValue2" inputId="test-check-2" value="2"
      >Test check button 2</sbb-checkbox
    >
  `
})
class ModelCheckboxTestComponent {
  checkValue1 = false;
  checkValue2 = false;
}

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, IconCollectionModule],
      declarations: [CheckboxComponent]
    })
      .overrideComponent(CheckboxComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, IconCollectionModule],
      declarations: [CheckboxComponent, ModelCheckboxTestComponent]
    })
      .overrideComponent(CheckboxComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    modelComponentFixture = TestBed.createComponent(ModelCheckboxTestComponent);
    modelComponent = modelComponentFixture.componentInstance;

    modelComponentFixture.detectChanges();
  });

  it('should create', () => {
    expect(modelComponent).toBeTruthy();
  });

  it('should create mock component and should contain two sbb-checkbox components', () => {
    expect(modelComponent).toBeTruthy();

    const checkboxComponents = modelComponentFixture.debugElement.queryAll(
      By.directive(CheckboxComponent)
    );
    expect(checkboxComponents).toBeTruthy();
    expect(checkboxComponents.length).toBe(2);
  });

  it('should check when click the label', () => {
    const checkboxLabel = modelComponentFixture.debugElement.query(
      By.css('label[for="test-check-1"]')
    );
    expect(checkboxLabel).toBeTruthy();

    checkboxLabel.nativeElement.click();

    const checkboxComponent = modelComponentFixture.debugElement.query(
      By.directive(CheckboxComponent)
    );
    expect(checkboxComponent).toBeTruthy();

    const checkboxChecked = checkboxComponent.queryAll(By.css('input:checked'));
    expect(checkboxChecked).toBeTruthy();
    expect(checkboxChecked.length).toBe(1);
  });

  it('should checked if model is true', async () => {
    const checkboxLabel = modelComponentFixture.debugElement.query(
      By.css('label[for="test-check-1"]')
    );
    expect(checkboxLabel).toBeTruthy();

    modelComponent.checkValue1 = true;
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();

    const components = modelComponentFixture.debugElement.queryAll(By.directive(CheckboxComponent));
    expect(components[0].componentInstance._checked).toBe(true);
    expect(modelComponent.checkValue1).toBe(true);

    const checkboxLabel2 = modelComponentFixture.debugElement.query(
      By.css('label[for="test-check-2"]')
    );
    expect(checkboxLabel2).toBeTruthy();

    checkboxLabel2.nativeElement.click();
    modelComponentFixture.detectChanges();

    await modelComponentFixture.whenStable();
    expect(components[1].componentInstance._checked).toBe(true);
    expect(modelComponent.checkValue2).toBe(true);
  });
});

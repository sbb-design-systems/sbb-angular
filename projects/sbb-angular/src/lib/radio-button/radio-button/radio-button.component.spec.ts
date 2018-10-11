import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonComponent } from './radio-button.component';

@Component({
  selector: 'sbb-radio-button-test',
  template: '<sbb-radio-button [(ngModel)]="testValue" inputId="test-radio-1" name="test-radio" inputValue="1">' +
            '</sbb-radio-button>' +
            '<label for="test-radio-1">Test radio button 1</label>' +
            '<sbb-radio-button [(ngModel)]="testValue" inputId="test-radio-2" name="test-radio" inputValue="2">' +
            '</sbb-radio-button>' +
            '<label for="test-radio-2">Test radio button 2</label>' +
            '<input type="text" [(ngModel)]="testValue">'
})
class RadioButtonTestComponent {
  testValue = '2';
}

fdescribe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let mockComponent: RadioButtonTestComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;
  let mockComponentFixture: ComponentFixture<RadioButtonTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [ RadioButtonComponent, RadioButtonTestComponent ]
    })
    .overrideComponent(RadioButtonComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonComponent);
    component = fixture.componentInstance;

    mockComponentFixture = TestBed.createComponent(RadioButtonTestComponent);
    mockComponent = mockComponentFixture.componentInstance;

    fixture.detectChanges();
    mockComponentFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create mock component and should contain two sbb-radio-button components', () => {
    expect(mockComponent).toBeTruthy();

    const radiobuttonComponents = mockComponentFixture.debugElement.queryAll(By.directive(RadioButtonComponent));
    expect(radiobuttonComponents).toBeTruthy();
    expect(radiobuttonComponents.length).toBe(2);
  });

  it('should check the radio button when click a label', () => {
    const radiobuttonLabel = mockComponentFixture.debugElement.query(By.css('label[for="test-radio-1"]'));
    expect(radiobuttonLabel).toBeTruthy();

    radiobuttonLabel.nativeElement.click();

    const radioButtonComponent = mockComponentFixture.debugElement.query(By.directive(RadioButtonComponent));
    expect(radioButtonComponent).toBeTruthy();

    const radioButtonChecked = radioButtonComponent.queryAll(By.css('input:checked'));
    expect(radioButtonChecked).toBeTruthy();
    expect(radioButtonChecked.length).toBe(1);
  });

  it('should be mutual exclusive', () => {
    const radiobuttonLabel = mockComponentFixture.debugElement.query(By.css('label[for="test-radio-1"]'));
    expect(radiobuttonLabel).toBeTruthy();

    radiobuttonLabel.nativeElement.click();

    let radioButtonChecked = mockComponentFixture.debugElement.queryAll(By.css('input:checked'));
    expect(radioButtonChecked).toBeTruthy();
    expect(radioButtonChecked.length).toBe(1);

    const radiobuttonLabel2 = mockComponentFixture.debugElement.query(By.css('label[for="test-radio-2"]'));
    expect(radiobuttonLabel2).toBeTruthy();

    radiobuttonLabel2.nativeElement.click();

    radioButtonChecked = mockComponentFixture.debugElement.queryAll(By.css('input:checked'));
    expect(radioButtonChecked).toBeTruthy();
    expect(radioButtonChecked.length).toBe(1);
  });

  fit('should check if model is equal to value', () => {
    const radiobuttonLabel = mockComponentFixture.debugElement.query(By.css('label[for="test-radio-1"]'));
    expect(radiobuttonLabel).toBeTruthy();

    mockComponent.testValue = '1';
    mockComponentFixture.detectChanges();

    const radiobuttonLabel2 = mockComponentFixture.debugElement.query(By.css('label[for="test-radio-2"]'));
    expect(radiobuttonLabel2).toBeTruthy();

    radiobuttonLabel2.nativeElement.click();
    mockComponentFixture.detectChanges();
  });
});

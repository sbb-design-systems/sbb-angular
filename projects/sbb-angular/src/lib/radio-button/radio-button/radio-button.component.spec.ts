import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonComponent } from './radio-button.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sbb-radio-button-test',
  template: '<sbb-radio-button [(ngModel)]="testValue" id="test-radio-1" name="test-radio"></sbb-radio-button>' +
            '<label for="test-radio-1">Test radio button value</label><br />' +
            '{{testValue}}'
})
class RadioButtonTestComponent {
  testValue = true;
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

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('should create mock component', () => {
    expect(mockComponent).toBeTruthy();
  });
});

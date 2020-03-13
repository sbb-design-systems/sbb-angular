import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createMouseEvent, dispatchEvent } from '@sbb-esta/angular-core/testing';

import { TimeInputDirective } from './time-input.directive';

@Component({
  template: `
    <input sbbTimeInput />
  `
})
class TimeInputTestComponent {}

describe('TimeInputDirective', () => {
  let component: TimeInputTestComponent;
  let fixture: ComponentFixture<TimeInputTestComponent>;
  let input: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeInputTestComponent, TimeInputDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeInputTestComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have proper type, pattern, inputmode, class attributes set', () => {
    expect(input.getAttribute('type')).toEqual('text');
    expect(input.getAttribute('pattern')).toEqual('[0-9]*');
    expect(input.getAttribute('inputmode')).toEqual('numeric');
    expect(input.getAttribute('class')).toEqual('sbb-time-input');
  });

  it('should take as input digits with no numbers in it and leave unchanged the value', () => {
    input.value = 'abcd';
    dispatchEvent(input, createMouseEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toEqual('abcd');
  });

  it('should take as input 4 number digits and separate with colon', () => {
    input.value = '1234';
    dispatchEvent(input, createMouseEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toEqual('12:34');
  });

  it('should take as input 2 number digits and separate with colon and put 00 as minutes', () => {
    input.value = '12';
    dispatchEvent(input, createMouseEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toEqual('12:00');
  });

  // tslint:disable-next-line:max-line-length
  it('should take as input 2 number digits separated with .:,-; and format assigning the first digit as hour and the second as minute', () => {
    input.value = '1:2';
    dispatchEvent(input, createMouseEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toEqual('01:02');

    input.value = '1.2';
    dispatchEvent(input, createMouseEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toEqual('01:02');

    input.value = '1,2';
    dispatchEvent(input, createMouseEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toEqual('01:02');

    input.value = '1-2';
    dispatchEvent(input, createMouseEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toEqual('01:02');

    input.value = '1;2';
    dispatchEvent(input, createMouseEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toEqual('01:02');
  });
});

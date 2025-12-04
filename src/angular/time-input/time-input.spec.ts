import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { typeInElement } from '@sbb-esta/angular/core/testing';
import { SbbInputModule } from '@sbb-esta/angular/input';

import { SbbTimeInputModule } from './time-input.module';

@Component({
  template: `<input sbbTimeInput />`,
  imports: [SbbTimeInputModule],
})
class BasicTimeInput {}

@Component({
  template: `<input sbbTimeInput [placeholder]="placeholder" />`,
  imports: [SbbTimeInputModule],
})
class PlaceholderTimeInput {
  placeholder = 'Time';
}

@Component({
  template: `<sbb-form-field label="Time Input">
    <input [formControl]="formControl" sbbInput sbbTimeInput />
  </sbb-form-field>`,
  imports: [SbbInputModule, ReactiveFormsModule, SbbTimeInputModule],
})
class FormControlTimeInput {
  formControl = new FormControl('');
}

describe('SbbTimeInput', () => {
  const values = [
    { input: '16:30', expectedOutput: '16:30' },
    { input: '1', expectedOutput: '01:00' },
    { input: '12', expectedOutput: '12:00' },
    { input: '123', expectedOutput: '01:23' },
    { input: '1234', expectedOutput: '12:34' },
    { input: '13567', expectedOutput: '13:56' },
    { input: '3.56', expectedOutput: '03:56' },
    { input: '23,4', expectedOutput: '23:04' },
    { input: '1,30', expectedOutput: '01:30' },
    { input: '1:2', expectedOutput: '01:02' },
    { input: '1.2', expectedOutput: '01:02' },
    { input: '1,2', expectedOutput: '01:02' },
    { input: '1-2', expectedOutput: '01:02' },
    { input: '1;2', expectedOutput: '01:02' },
    { input: 'nonNumeric', expectedOutput: 'nonNumeric' },
  ];

  it('should have proper type, pattern, inputmode, class attributes set', () => {
    const fixture = TestBed.createComponent(BasicTimeInput);
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();

    expect(inputElement.getAttribute('type')).toEqual('text');
    expect(inputElement.getAttribute('pattern')).toEqual('[0-9]*');
    expect(inputElement.getAttribute('inputmode')).toEqual('numeric');
    expect(inputElement.getAttribute('class')).toContain('sbb-time-input');
    expect(inputElement.getAttribute('placeholder')).toEqual('HH:MM');
  });

  it('should accept custom placeholder', () => {
    const fixture = TestBed.createComponent(PlaceholderTimeInput);
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
    expect(inputElement.getAttribute('placeholder')).toBe('Time');
  });

  it('should change placeholder', () => {
    const fixture = TestBed.createComponent(PlaceholderTimeInput);
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();

    fixture.componentInstance.placeholder = 'Other';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(inputElement.getAttribute('placeholder')).toBe('Other');

    fixture.componentInstance.placeholder = '';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(inputElement.getAttribute('placeholder')).toEqual('');

    fixture.componentInstance.placeholder = null!;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(inputElement.getAttribute('placeholder')).toEqual('HH:MM');

    fixture.componentInstance.placeholder = undefined!;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(inputElement.getAttribute('placeholder')).toEqual('HH:MM');
  });

  it('should display values formatted without form control', () => {
    const fixture = TestBed.createComponent(BasicTimeInput);
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    values.forEach((entry) => {
      inputElement.value = '';

      typeInElement(inputElement, entry.input);
      inputElement.blur();

      expect(inputElement.value).toBe(entry.expectedOutput);
    });
  });

  it('should display values formatted with form control', () => {
    const fixture = TestBed.createComponent(FormControlTimeInput);
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    values.forEach((entry) => {
      fixture.componentInstance.formControl.setValue('');
      fixture.detectChanges();

      typeInElement(inputElement, entry.input);
      inputElement.blur();

      expect(fixture.componentInstance.formControl.value).toBe(entry.expectedOutput);
    });
  });
});

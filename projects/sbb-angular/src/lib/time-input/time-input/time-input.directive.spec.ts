import { TimeInputDirective } from './time-input.directive';
import { Component } from '@angular/core';

@Component({
  template: `<input type="text" sbbTimeInput>`
})
class TimeInputTestComponent {
}

describe('TimeInputDirective', () => {
  it('should create an instance', () => {
    const component = new TimeInputTestComponent();
    expect(component).toBeTruthy();
  });
});

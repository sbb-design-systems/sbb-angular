import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sbbClearTarget]',
  exportAs: 'sbbClearTarget'
})
export class ClearInputTargetDirective {
  constructor(public ngControl: NgControl) {}
}

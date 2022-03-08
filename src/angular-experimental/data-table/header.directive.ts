import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[sbbDataTableHeader]',
})
export class SbbDataTableHeaderDirective {
  constructor(public readonly template: TemplateRef<unknown>) {}
}

import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[sbbDataTableFilter]',
})
export class SbbDataTableFilterDirective {
  constructor(public readonly template: TemplateRef<unknown>) {}
}

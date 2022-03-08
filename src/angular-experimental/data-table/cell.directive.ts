import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[sbbDataTableCell]',
})
export class SbbDataTableCellDirective<T> {
  constructor(public readonly template: TemplateRef<T>) {}
}

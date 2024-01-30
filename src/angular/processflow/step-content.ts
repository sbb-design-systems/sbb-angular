import { Directive, TemplateRef } from '@angular/core';

/**
 * Content for a `sbb-step` that will be rendered lazily.
 */
@Directive({
  selector: 'ng-template[sbbStepContent]',
  standalone: true,
})
export class SbbStepContent {
  constructor(public _template: TemplateRef<any>) {}
}

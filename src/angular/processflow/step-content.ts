import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Content for a `sbb-step` that will be rendered lazily.
 */
@Directive({
  selector: 'ng-template[sbbStepContent]',
})
export class SbbStepContent {
  _template: TemplateRef<any> = inject<TemplateRef<any>>(TemplateRef);

  constructor(...args: unknown[]);
  constructor() {}
}

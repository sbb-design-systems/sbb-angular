import { StepState } from '@angular/cdk/stepper';
import { Directive, Input, TemplateRef } from '@angular/core';

/** Template context available to an attached `sbbProcessflowIcon`. */
export interface SbbProcessflowIconContext {
  /** Index of the step. */
  index: number;
  /** Whether the step is currently active. */
  active: boolean;
  /** Whether the step is optional. */
  optional: boolean;
}

/**
 * Template to be used to override the icons inside the step header.
 */
@Directive({
  selector: 'ng-template[sbbProcessflowIcon]',
})
export class SbbProcessflowIcon {
  /** Name of the icon to be overridden. */
  @Input('sbbProcessflowIcon') name: StepState;

  constructor(public templateRef: TemplateRef<SbbProcessflowIconContext>) {}
}

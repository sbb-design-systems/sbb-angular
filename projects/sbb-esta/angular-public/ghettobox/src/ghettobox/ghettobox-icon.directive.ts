import { Directive } from '@angular/core';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';

/**
 * Structural Directive to insert an icon from content projection
 * @deprecated Use sbbIcon instead
 */
@Directive({
  selector: '[sbbGhettoboxIcon]',
  providers: [{ provide: IconDirective, useExisting: GhettoboxIconDirective }]
})
export class GhettoboxIconDirective {}

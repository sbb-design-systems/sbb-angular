import { Directive } from '@angular/core';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';

/** @deprecated Use sbbIcon instead */
@Directive({
  selector: '[sbbTooltipIcon]',
  providers: [{ provide: IconDirective, useExisting: TooltipIconDirective }]
})
export class TooltipIconDirective {}

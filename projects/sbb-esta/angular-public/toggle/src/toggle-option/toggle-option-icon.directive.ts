import { Directive } from '@angular/core';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';

/** @deprecated Use sbbIcon instead */
@Directive({
  selector: '[sbbToggleOptionIcon]',
  providers: [{ provide: IconDirective, useExisting: ToggleOptionIconDirective }]
})
export class ToggleOptionIconDirective {}

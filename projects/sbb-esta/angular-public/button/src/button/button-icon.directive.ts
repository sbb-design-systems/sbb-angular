import { Directive } from '@angular/core';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';

// @deprecated Use sbbIcon instead
@Directive({
  selector: '[sbbButtonIcon]',
  providers: [{ provide: IconDirective, useExisting: ButtonIconDirective }]
})
export class ButtonIconDirective {}

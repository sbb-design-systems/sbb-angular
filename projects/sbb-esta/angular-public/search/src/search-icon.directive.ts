import { Directive } from '@angular/core';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive/';

/**
 * @deprecated Use sbbIcon instead
 */
@Directive({
  selector: '[sbbSearchIcon]',
  providers: [{ provide: IconDirective, useExisting: SearchIconDirective }]
})
export class SearchIconDirective {}

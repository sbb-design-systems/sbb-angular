import { Directive } from '@angular/core';
// TODO Check if this directive is really neccessary
@Directive({
  selector: 'sbb-label',
  host: {
    class: 'sbb-label',
  },
})
export class SbbLabel {}

import { Directive } from '@angular/core';

@Directive({
  selector: 'sbb-label',
  host: {
    class: 'sbb-label',
  },
  standalone: true,
})
export class SbbLabel {}

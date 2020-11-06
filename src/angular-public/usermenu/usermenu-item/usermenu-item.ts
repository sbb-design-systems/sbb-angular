import { Directive } from '@angular/core';

@Directive({
  selector: 'a[sbb-usermenu-item], button[sbb-usermenu-item]',
  host: {
    class: 'sbb-usermenu-item',
  },
})
export class SbbUsermenuItem {}

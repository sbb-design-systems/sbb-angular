import { Directive } from '@angular/core';

@Directive({
  selector: 'sbb-breadcrumb',
  exportAs: 'sbbBreadcrumb',
  host: {
    class: 'sbb-breadcrumb sbb-icon-fit',
    role: 'listitem',
  },
  standalone: true,
})
export class SbbBreadcrumb {}

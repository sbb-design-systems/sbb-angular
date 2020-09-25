import { NavigationExtras } from '@angular/router';

export interface SbbLinkGeneratorResult extends NavigationExtras {
  /** Router reference to navigate between page buttons. */
  routerLink: string | any[];
}

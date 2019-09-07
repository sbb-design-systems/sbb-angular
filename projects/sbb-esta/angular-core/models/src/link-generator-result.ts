import { NavigationExtras } from '@angular/router';

export interface LinkGeneratorResult extends NavigationExtras {
  /** Router reference to navigate between page buttons. */
  routerLink: string | any[];
}

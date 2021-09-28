import { NavigationExtras } from '@angular/router';

export interface SbbRouterLink extends NavigationExtras {
  /** Router reference to navigate between page buttons. */
  routerLink: string | any[];
}

/** Ghettobox configuration to be passed to the service to create an instance. */
export interface SbbGhettoboxConfig {
  /**
   * Icon to be used in the ghettobox.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="kom:plus-small"
   */
  svgIcon?: string;
  /** Link to be used for the ghettobox. Will be applied to routerLink. */
  routerLink?: string | any[] | SbbRouterLink;
  /** Link to be used for the ghettobox. Will be treated as an external link. */
  link?: string;
}

import { NavigationExtras } from '@angular/router';

export interface SbbRouterLink extends NavigationExtras {
  /** Router reference to navigate between page buttons. */
  routerLink: string | any[];
}

/** Alert configuration to be passed to the service to create an instance. */
export interface SbbAlertConfig {
  /**
   * Icon to be used in the alert.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="kom:plus-small"
   */
  svgIcon?: string;
  /** Link to be used for the alert. Will be applied to routerLink. */
  routerLink?: string | any[] | SbbRouterLink;
  /** Link to be used for the alert. Will be treated as an external link. */
  link?: string;
}

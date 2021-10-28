import { EmbeddedViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { SbbAlertConfig, SbbRouterLink } from './alert-config';
import { SbbAlertOutlet } from './alert-outlet';

export class SbbAlertRefConnector implements SbbAlertConfig {
  /** The message to display in the alert. */
  message: string;
  /**
   * Icon to be used in the alert.
   * Must be a valid svgIcon input for sbb-icon.
   */
  svgIcon?: string;
  /** Link to be used for the alert. Will be applied to routerLink. */
  routerLink?: SbbRouterLink;
  /** Link to be used for the alert. Will be treated as an external link. */
  link?: string;
  /** Subject which will emit once the dismissed event happened. */
  readonly afterDismissed = new Subject<void>();

  constructor(message: string, config: SbbAlertConfig) {
    this.message = message;
    this.svgIcon = config.svgIcon;
    this.routerLink =
      typeof config.routerLink === 'string' || Array.isArray(config.routerLink)
        ? { routerLink: config.routerLink }
        : config.routerLink;
    this.link = config.link;
  }

  /** Handles the dismissed event of the referenced alert. */
  _handleDismissed() {
    if (!this.afterDismissed.closed) {
      this.afterDismissed.next();
      this.afterDismissed.complete();
    }
  }
}

/**
 * Reference to a alert created via service API.
 */
export class SbbAlertRef {
  /** The instance of the component making up the content of the alert. */
  instance: EmbeddedViewRef<any>;

  // noinspection JSUnusedGlobalSymbols
  constructor(readonly instanceOutlet: SbbAlertOutlet, private _connector: SbbAlertRefConnector) {
    this.afterDismissed().subscribe(() => this.instance.destroy());
  }

  dismiss(): void {
    if (!this._connector.afterDismissed.closed) {
      this.instance.destroy();
      this._connector._handleDismissed();
    }
  }

  /** Gets an observable that is notified when the alert has been dismissed. */
  afterDismissed(): Observable<void> {
    return this._connector.afterDismissed;
  }
}

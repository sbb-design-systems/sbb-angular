import { EmbeddedViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { SbbGhettoboxConfig, SbbRouterLink } from './ghettobox-config';
import type { SbbGhettoboxOutlet } from './ghettobox-outlet';

export class SbbGhettoboxRefConnector implements SbbGhettoboxConfig {
  /** The message to display in the ghettobox. */
  message: string;
  /**
   * Icon to be used in the ghettobox.
   * Must be a valid svgIcon input for sbb-icon.
   */
  svgIcon?: string;
  /** Link to be used for the ghettobox. Will be applied to routerLink. */
  routerLink?: SbbRouterLink;
  /** Link to be used for the ghettobox. Will be treated as an external link. */
  link?: string;
  /** Subject which will emit once the dismissed event happened. */
  readonly afterDismissed = new Subject<void>();

  constructor(message: string, config: SbbGhettoboxConfig) {
    this.message = message;
    this.svgIcon = config.svgIcon;
    this.routerLink =
      typeof config.routerLink === 'string' || Array.isArray(config.routerLink)
        ? { routerLink: config.routerLink }
        : config.routerLink;
    this.link = config.link;
  }

  /** Handles the dismissed event of the referenced ghettobox. */
  _handleDismissed() {
    if (!this.afterDismissed.closed) {
      this.afterDismissed.next();
      this.afterDismissed.complete();
    }
  }
}

/**
 * Reference to a ghettobox created via service API.
 */
export class SbbGhettoboxRef {
  /** The instance of the component making up the content of the snack bar. */
  instance: EmbeddedViewRef<any>;

  constructor(
    readonly instanceOutlet: SbbGhettoboxOutlet,
    private _connector: SbbGhettoboxRefConnector
  ) {
    this.afterDismissed().subscribe(() => this.instance.destroy());
  }

  dismiss(): void {
    if (!this._connector.afterDismissed.closed) {
      this.instance.destroy();
      this._connector._handleDismissed();
    }
  }

  /** Gets an observable that is notified when the ghettobox has been dismissed. */
  afterDismissed(): Observable<void> {
    return this._connector.afterDismissed;
  }
}

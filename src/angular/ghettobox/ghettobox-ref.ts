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
   *
   * e.g. indicatorIcon="kom:plus-small"
   */
  icon?: string;
  /** Link to be used for the ghettobox. Will be applied to routerLink. */
  routerLink?: SbbRouterLink;
  /** Link to be used for the ghettobox. Will be treated as an external link. */
  link?: string;
  /** Subject which will emit once the removed event happened. */
  readonly afterRemoved = new Subject<void>();

  constructor(message: string, config: SbbGhettoboxConfig) {
    this.message = message;
    this.icon = config.icon;
    this.routerLink =
      typeof config.routerLink === 'string' || Array.isArray(config.routerLink)
        ? { routerLink: config.routerLink }
        : config.routerLink;
    this.link = config.link;
  }

  /** Handles the removed event of the referenced ghettobox. */
  _handleRemoved() {
    if (!this.afterRemoved.closed) {
      this.afterRemoved.next();
      this.afterRemoved.complete();
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
    this.afterRemoved().subscribe(() => this.instance.destroy());
  }

  remove(): void {
    if (!this._connector.afterRemoved.closed) {
      this.instance.destroy();
      this._connector._handleRemoved();
    }
  }

  /** Gets an observable that is notified when the ghettobox has been removed. */
  afterRemoved(): Observable<void> {
    return this._connector.afterRemoved;
  }
}

import { AnimationEvent } from '@angular/animations';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  DomPortal,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { NotificationSimpleConfig } from '../notification-simple/notification-simple-config';

import { NOTIFICATION_ANIMATIONS } from './notification-animations';

@Component({
  selector: 'sbb-notification-container',
  templateUrl: './notification-simple-container.component.html',
  styleUrls: ['../../notification/notification.component.scss'],
  // In Ivy embedded views will be change detected from their declaration place, rather than
  // where they were stamped out. This means that we can't have the notification container be OnPush,
  // because it might cause notifications that were opened from a template not to be out of date.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  animations: [NOTIFICATION_ANIMATIONS.notificationState],
  host: {
    class: 'sbb-notification',
    '[class.sbb-notification-success]': 'config.type === "success"',
    '[class.sbb-notification-info]': 'config.type === "info"',
    '[class.sbb-notification-warn]': 'config.type === "warn"',
    '[class.sbb-notification-error]': 'config.type === "error"',
    '[attr.role]': '_role',
    '[attr.aria-hidden]': 'ariaHidden',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
    '[@state]': '_animationState',
    '(@state.done)': 'onAnimationEnd($event)',
  },
})
export class NotificationSimpleContainerComponent extends BasePortalOutlet implements OnDestroy {
  private _destroyed = false;

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  /** @docs-private */
  @ViewChild('error', { read: TemplateRef, static: true })
  errorIcon: TemplateRef<any>;

  /** @docs-private */
  @ViewChild('check', { read: TemplateRef, static: true })
  checkIcon: TemplateRef<any>;

  /** @docs-private */
  @ViewChild('info', { read: TemplateRef, static: true })
  infoIcon: TemplateRef<any>;

  get icon(): TemplateRef<any> | null {
    switch (this.config.type) {
      case 'success':
        return this.checkIcon;
      case 'error':
      case 'warn':
        return this.errorIcon;
      case 'info':
        return this.infoIcon;
      default:
        return null;
    }
  }

  ariaHidden: 'true' | 'false' = 'false';
  _animationState = 'void';
  _role: 'alert' | 'status' | null;

  readonly _onExit: Subject<any> = new Subject();
  readonly _onEnter: ReplaySubject<any> = new ReplaySubject();

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    public config: NotificationSimpleConfig
  ) {
    super();
    // Based on the ARIA spec, `alert` and `status` roles have an
    // implicit `assertive` and `polite` politeness respectively.
    if (config.politeness === 'assertive' && !config.announcementMessage) {
      this._role = 'alert';
    } else if (config.politeness === 'off') {
      this._role = null;
    } else {
      this._role = 'status';
    }
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    this._assertNotAttached();
    this._applyNotificationClasses();
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    this._assertNotAttached();
    this._applyNotificationClasses();
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  attachDomPortal = (portal: DomPortal) => {
    this._assertNotAttached();
    this._applyNotificationClasses();
    return this._portalOutlet.attachDomPortal(portal);
  };

  onAnimationEnd(event: AnimationEvent) {
    const { fromState, toState } = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'hidden') {
      this._completeExit();
    }

    if (toState === 'visible') {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this._onEnter;

      this._ngZone.run(() => {
        onEnter.next();
        onEnter.complete();
      });
    }
  }

  exit(): Observable<void> {
    this.ariaHidden = 'true';
    this._animationState = 'hidden';
    this._completeExit();

    return this._onExit;
  }

  enter(): void {
    if (!this._destroyed) {
      this._animationState = 'visible';
      this._changeDetectorRef.detectChanges();
      this._onEnter.next();
      this._onEnter.complete();
    }
  }

  ngOnDestroy() {
    this._destroyed = true;
    this._completeExit();
  }

  private _completeExit() {
    this._onExit.next();
    this._onExit.complete();
  }

  private _applyNotificationClasses() {
    const element: HTMLElement = this._elementRef.nativeElement;
    const panelClasses = this.config.panelClass;

    if (panelClasses) {
      if (Array.isArray(panelClasses)) {
        // Note that we can't use a spread here, because IE doesn't support multiple arguments.
        panelClasses.forEach((cssClass) => element.classList.add(cssClass));
      } else {
        element.classList.add(panelClasses);
      }
    }

    // currently, only a centered position is supported
    element.classList.add('notification-center');

    if (this.config.verticalPosition === 'top') {
      element.classList.add('notification-top');
    }
  }

  private _assertNotAttached() {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Attempting to attach notification content after content is already attached');
    }
  }
}

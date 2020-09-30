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
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { SBB_NOTIFICATION_TOAST_ANIMATIONS } from './notification-toast-animations';
import { SbbNotificationToastConfig } from './notification-toast-config';

@Component({
  selector: 'sbb-notification-toast-container',
  templateUrl: './notification-toast-container.component.html',
  styleUrls: ['./notification-toast-container.component.css'],
  // In Ivy embedded views will be change detected from their declaration place, rather than
  // where they were stamped out. This means that we can't have the notification container be OnPush,
  // because it might cause notifications that were opened from a template not to be out of date.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  animations: [SBB_NOTIFICATION_TOAST_ANIMATIONS.notificationState],
  host: {
    class: 'sbb-notification-toast',
    '[class.sbb-notification-toast-success]': 'config.type === "success"',
    '[class.sbb-notification-toast-info]': 'config.type === "info"',
    '[class.sbb-notification-toast-warn]': 'config.type === "warn"',
    '[class.sbb-notification-toast-error]': 'config.type === "error"',
    '[attr.role]': '_role',
    '[@state]': '_animationState',
    '(@state.done)': 'onAnimationEnd($event)',
  },
})
export class SbbNotificationToastContainer extends BasePortalOutlet implements OnDestroy {
  private _destroyed = false;

  /** The portal outlet inside of this container into which the notification toast content will be loaded. */
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  /** Subject for notifying that the notification toast has exited from view. */
  readonly _onExit: Subject<void> = new Subject();

  /** Subject for notifying that the notification toast has finished entering the view. */
  readonly _onEnter: Subject<void> = new Subject();

  /** The state of the notification toast animations. */
  _animationState = 'void';

  /** ARIA role for the notification toast container. */
  _role: 'alert' | 'status' | null;

  get _svgIcon() {
    switch (this.config.type) {
      case 'success':
        return 'kom:tick-small';
      case 'error':
      case 'warn':
        return 'kom:sign-exclamation-point-small';
      default:
        return 'kom:circle-information-small';
    }
  }

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    public config: SbbNotificationToastConfig
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

  /** Attach a component portal as content to this notification toast container. */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    this._assertNotAttached();
    this._applyNotificationClasses();
    return this._portalOutlet.attachComponentPortal(portal);
  }

  /** Attach a template portal as content to this notification toast container. */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    this._assertNotAttached();
    this._applyNotificationClasses();
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /**
   * Attaches a DOM portal to the notification toast container.
   * @deprecated To be turned into a method.
   * @breaking-change 10.0.0
   */
  attachDomPortal = (portal: DomPortal) => {
    this._assertNotAttached();
    this._applyNotificationClasses();
    return this._portalOutlet.attachDomPortal(portal);
  };

  /** Handle end of animations, updating the state of the notification toast. */
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

  /** Begin animation of notification toast entrance into view. */
  enter(): void {
    if (!this._destroyed) {
      this._animationState = 'visible';
      this._changeDetectorRef.detectChanges();
    }
  }

  /** Begin animation of the notification toast exiting from view. */
  exit(): Observable<void> {
    // Note: this one transitions to `hidden`, rather than `void`, in order to handle the case
    // where multiple notification toasts are opened in quick succession (e.g. two consecutive calls to
    // `SbbNotificationToast.open`).
    this._animationState = 'hidden';

    // Mark this element with an 'exit' attribute to indicate that the notification toast has
    // been dismissed and will soon be removed from the DOM. This is used by the notification toast
    // test harness.
    this._elementRef.nativeElement.setAttribute('sbb-exit', '');

    return this._onExit;
  }

  /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
  ngOnDestroy() {
    this._destroyed = true;
    this._completeExit();
  }

  /**
   * Waits for the zone to settle before removing the element. Helps prevent
   * errors where we end up removing an element which is in the middle of an animation.
   */
  private _completeExit() {
    this._ngZone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
      this._onExit.next();
      this._onExit.complete();
    });
  }

  /** Applies the various positioning and user-configured CSS classes to the notification toast. */
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
    element.classList.add('sbb-notification-toast-center');

    if (this.config.verticalPosition === 'top') {
      element.classList.add('sbb-notification-toast-top');
    }
  }

  /** Asserts that no content is already attached to the container. */
  private _assertNotAttached() {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Attempting to attach notification content after content is already attached');
    }
  }
}

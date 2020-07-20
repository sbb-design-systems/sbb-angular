import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { NotificationSimpleContainerComponent } from '../notification-simple-container/notification-simple-container.component';

import { NotificationSimpleConfig } from './notification-simple-config';
import { NotificationSimpleRef } from './notification-simple-ref';
import { NotificationSimpleComponent } from './notification-simple.component';

export const NOTIFICATION_CONFIG = new InjectionToken<any>('NotificationData');

export const NOTIFICATION_DEFAULT_OPTIONS = new InjectionToken<NotificationSimpleConfig>(
  'notification-default-options',
  {
    providedIn: 'root',
    factory: notificationDefaultOptionsFactory,
  }
);

export function notificationDefaultOptionsFactory(): NotificationSimpleConfig {
  return new NotificationSimpleConfig();
}

@Injectable()
export class Notification implements OnDestroy {
  private _notificationRefAtThisLevel: NotificationSimpleRef<any> | null = null;

  get _openedNotificationRef(): NotificationSimpleRef<any> | null {
    const parent = this._parentNotification;
    return parent ? parent._openedNotificationRef : this._notificationRefAtThisLevel;
  }

  set _openedNotificationRef(value: NotificationSimpleRef<any> | null) {
    if (this._parentNotification) {
      this._parentNotification._openedNotificationRef = value;
    } else {
      this._notificationRefAtThisLevel = value;
    }
  }

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _live: LiveAnnouncer,
    private _breakpointObserver: BreakpointObserver,
    @Optional() @SkipSelf() private _parentNotification: Notification,
    @Inject(NOTIFICATION_DEFAULT_OPTIONS) private _defaultConfig: NotificationSimpleConfig
  ) {}

  open(
    message: string,
    config?: NotificationSimpleConfig
  ): NotificationSimpleRef<NotificationSimpleComponent> {
    const notificationConfig = { ...this._defaultConfig, ...config };

    // Since the notification has `role="alert"`, we don't
    // want to announce the same message twice.
    if (notificationConfig.announcementMessage === message) {
      notificationConfig.announcementMessage = undefined;
    } else {
      notificationConfig.announcementMessage = message;
    }

    return this.openFromComponent(NotificationSimpleComponent, notificationConfig);
  }

  openFromTemplate(
    template: string,
    config?: NotificationSimpleConfig
  ): NotificationSimpleRef<NotificationSimpleComponent> {
    const notificationConfig = { ...this._defaultConfig, ...config };

    // Since the notification has `role="alert"`, we don't
    // want to announce the same message twice.
    if (notificationConfig.announcementMessage === template) {
      notificationConfig.announcementMessage = undefined;
    } else {
      notificationConfig.announcementMessage = template;
    }

    return this.openFromComponent(NotificationSimpleComponent, notificationConfig);
  }

  dismiss(): void {
    if (this._openedNotificationRef) {
      this._openedNotificationRef.dismiss();
    }
  }

  ngOnDestroy() {
    // Only dismiss the notification at the current level on destroy.
    if (this._notificationRefAtThisLevel) {
      this._notificationRefAtThisLevel.dismiss();
    }
  }

  openFromComponent<T>(
    component: ComponentType<T>,
    config?: NotificationSimpleConfig
  ): NotificationSimpleRef<T> {
    return this._attach(component, config) as NotificationSimpleRef<T>;
  }

  private _attach<T>(
    content: ComponentType<T> | TemplateRef<T>,
    userConfig?: NotificationSimpleConfig
  ): NotificationSimpleRef<T | EmbeddedViewRef<any>> {
    const config = { ...new NotificationSimpleConfig(), ...this._defaultConfig, ...userConfig };
    const overlayRef = this._createOverlay(config);
    const container = this._attachNotificationContainer(overlayRef, config);
    const notificationRef = new NotificationSimpleRef<T | EmbeddedViewRef<any>>(
      container,
      overlayRef
    );

    if (content instanceof TemplateRef) {
      const portal = new TemplatePortal(content, null!, {
        $implicit: config.announcementMessage,
        notificationRef,
      } as any);

      notificationRef.instance = container.attachTemplatePortal(portal);
    } else {
      const injector = this._createInjector(config, notificationRef);
      const portal = new ComponentPortal(content, undefined, injector);
      const contentRef = container.attachComponentPortal<T>(portal);

      // We can't pass this via the injector, because the injector is created earlier.
      notificationRef.instance = contentRef.instance;
    }

    // Subscribe to the breakpoint observer and attach the notification-handset class as
    // appropriate. This class is applied to the overlay element because the overlay must expand to
    // fill the width of the screen for full width notifications.
    this._breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(overlayRef.detachments()))
      .subscribe((state) => {
        const classList = overlayRef.overlayElement.classList;
        const className = 'notification-handset';
        state.matches ? classList.add(className) : classList.remove(className);
      });

    this._subscribeToNotificationChanges(notificationRef, config);
    this._openedNotificationRef = notificationRef;
    return notificationRef;
  }

  private _createOverlay(config: NotificationSimpleConfig): OverlayRef {
    const overlayConfig = new OverlayConfig();
    overlayConfig.direction = 'ltr';

    const positionStrategy = this._overlay.position().global();

    positionStrategy.centerHorizontally();
    if (config.verticalPosition === 'top') {
      positionStrategy.top('20px');
    } else {
      positionStrategy.bottom('20px');
    }

    overlayConfig.positionStrategy = positionStrategy;
    return this._overlay.create(overlayConfig);
  }

  private _createInjector<T>(
    config: NotificationSimpleConfig,
    notificationRef: NotificationSimpleRef<T>
  ): PortalInjector {
    const userInjector = config?.viewContainerRef?.injector;

    return new PortalInjector(
      userInjector || this._injector,
      new WeakMap<any, any>([
        [NotificationSimpleRef, notificationRef],
        [NOTIFICATION_CONFIG, config],
      ])
    );
  }

  private _attachNotificationContainer(
    overlayRef: OverlayRef,
    config: NotificationSimpleConfig
  ): NotificationSimpleContainerComponent {
    const userInjector = config?.viewContainerRef?.injector;
    const injector = new PortalInjector(
      userInjector || this._injector,
      new WeakMap([[NotificationSimpleConfig, config]])
    );

    const containerPortal = new ComponentPortal(
      NotificationSimpleContainerComponent,
      config.viewContainerRef,
      injector
    );
    const containerRef: ComponentRef<NotificationSimpleContainerComponent> = overlayRef.attach(
      containerPortal
    );
    containerRef.instance.config = config;
    return containerRef.instance;
  }

  private _subscribeToNotificationChanges(
    notificationRef: NotificationSimpleRef<any>,
    config: NotificationSimpleConfig
  ) {
    // When the snackbar is dismissed, clear the reference to it.
    notificationRef.afterDismissed().subscribe(() => {
      // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
      if (this._openedNotificationRef === notificationRef) {
        this._openedNotificationRef = null;
      }
    });

    this._animateNotification(notificationRef, config);
  }

  private _animateNotification(
    notificationRef: NotificationSimpleRef<any>,
    config: NotificationSimpleConfig
  ) {
    // When the snackbar is dismissed, clear the reference to it.
    notificationRef.afterDismissed().subscribe(() => {
      // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
      if (this._openedNotificationRef === notificationRef) {
        this._openedNotificationRef = null;
      }

      if (config.announcementMessage) {
        this._live.clear();
      }
    });

    if (this._openedNotificationRef) {
      // If a snack bar is already in view, dismiss it and enter the
      // new snack bar after exit animation is complete.
      this._openedNotificationRef.afterDismissed().subscribe(() => {
        notificationRef.containerInstance.enter();
      });
      this._openedNotificationRef.dismiss();
    } else {
      // If no snack bar is in view, enter the new snack bar.
      notificationRef.containerInstance.enter();
    }

    // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
    if (config.duration && config.duration > 0) {
      notificationRef.afterOpened().subscribe(() => notificationRef.dismissAfter(config.duration!));
    }

    if (config.announcementMessage) {
      this._live.announce(config.announcementMessage, config.politeness);
    }
  }
}

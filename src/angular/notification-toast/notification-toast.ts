import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ComponentType,
  createOverlayRef,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  TemplateRef,
  Type,
} from '@angular/core';
import { Breakpoints } from '@sbb-esta/angular/core';
import { takeUntil } from 'rxjs/operators';

import {
  SbbNotificationToastConfig,
  SBB_NOTIFICATION_TOAST_DATA,
} from './notification-toast-config';
import {
  SbbNotificationToastContainer,
  SbbNotificationToastContainerBase,
} from './notification-toast-container';
import { SbbNotificationToastRef } from './notification-toast-ref';
import { SbbNotificationToastModule } from './notification-toast.module';
import { SbbSimpleNotification, SbbTextOnlyNotificationToast } from './simple-notification';

/** Injection token that can be used to specify default notification toast. */
export const SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS =
  new InjectionToken<SbbNotificationToastConfig>('notification-default-options', {
    providedIn: 'root',
    factory: SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS_FACTORY,
  });

/** @docs-private */
export function SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS_FACTORY(): SbbNotificationToastConfig {
  return new SbbNotificationToastConfig();
}

/** Service to dispatch notification toast messages. */
@Injectable({ providedIn: SbbNotificationToastModule })
export class SbbNotificationToast implements OnDestroy {
  private _overlay = inject(Overlay);
  private _injector = inject(Injector);
  private _live = inject(LiveAnnouncer);
  private _breakpointObserver = inject(BreakpointObserver);
  private _parentNotification = inject(SbbNotificationToast, { optional: true, skipSelf: true })!;
  private _defaultConfig = inject<SbbNotificationToastConfig>(
    SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS,
  );

  /**
   * Reference to the current notification toast in the view *at this level* (in the Angular injector tree).
   * If there is a parent notification toast service, all operations should delegate to that parent
   * via `_openednotification toastRef`.
   */
  private _notificationRefAtThisLevel: SbbNotificationToastRef<any> | null = null;

  /** The component that should be rendered as the notification toast's simple component. */
  protected _simpleNotificationToastComponent: Type<SbbTextOnlyNotificationToast> =
    SbbSimpleNotification;

  /** The container component that attaches the provided template or component. */
  protected _notificationToastContainerComponent: Type<SbbNotificationToastContainerBase> =
    SbbNotificationToastContainer;

  /** The CSS class to applie for mobile mode. */
  protected _mobileDeviceCssClass: string = 'sbb-notification-toast-mobile';

  /** Reference to the currently opened notification toast at *any* level. */
  get _openedNotificationRef(): SbbNotificationToastRef<any> | null {
    const parent = this._parentNotification;
    return parent ? parent._openedNotificationRef : this._notificationRefAtThisLevel;
  }

  set _openedNotificationRef(value: SbbNotificationToastRef<any> | null) {
    if (this._parentNotification) {
      this._parentNotification._openedNotificationRef = value;
    } else {
      this._notificationRefAtThisLevel = value;
    }
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Creates and dispatches a notification toast with a custom component for the content, removing any
   * currently opened notification toasts.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the notification toast.
   */
  openFromComponent<T, D = any>(
    component: ComponentType<T>,
    config?: SbbNotificationToastConfig<D>,
  ): SbbNotificationToastRef<T> {
    return this._attach(component, config) as SbbNotificationToastRef<T>;
  }

  /**
   * Creates and dispatches a notification toast with a custom template for the content, removing any
   * currently opened notification toasts.
   *
   * @param template Template to be instantiated.
   * @param config Extra configuration for the notification toast.
   */
  openFromTemplate(
    template: TemplateRef<any>,
    config?: SbbNotificationToastConfig,
  ): SbbNotificationToastRef<EmbeddedViewRef<any>> {
    return this._attach(template, config);
  }

  /**
   * Opens a notification toast with a message and an optional action.
   * @param message The message to show in the notification toast.
   * @param action The label for the notification toast action.
   * @param config Additional configuration options for the notification toast.
   */
  open(
    message: string,
    config?: SbbNotificationToastConfig,
  ): SbbNotificationToastRef<SbbTextOnlyNotificationToast> {
    const mergedConfig = { ...this._defaultConfig, ...config };

    // Since the user doesn't have access to the component, we can
    // override the data to pass in our own message and action.
    mergedConfig.data = { message };

    // Since the notification toast has `role="alert"`, we don't
    // want to announce the same message twice.
    if (mergedConfig.announcementMessage === message) {
      mergedConfig.announcementMessage = undefined;
    }

    return this.openFromComponent(this._simpleNotificationToastComponent, mergedConfig);
  }

  /** Dismisses the currently-visible notification toast. */
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

  /** Attaches the notification toast container component to the overlay. */
  private _attachNotificationToastContainer(
    overlayRef: OverlayRef,
    config: SbbNotificationToastConfig,
  ): SbbNotificationToastContainerBase {
    const userInjector = config?.viewContainerRef?.injector;
    const injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [
        {
          provide: SbbNotificationToastConfig,
          useValue: config,
        },
      ],
    });

    const containerPortal = new ComponentPortal(
      this._notificationToastContainerComponent,
      config.viewContainerRef,
      injector,
    );
    const containerRef: ComponentRef<SbbNotificationToastContainerBase> =
      overlayRef.attach(containerPortal);
    containerRef.instance.config = config;
    return containerRef.instance;
  }

  /** Places a new component or a template as the content of the notification toast container. */
  private _attach<T>(
    content: ComponentType<T> | TemplateRef<T>,
    userConfig?: SbbNotificationToastConfig,
  ): SbbNotificationToastRef<T | EmbeddedViewRef<any>> {
    const config = { ...new SbbNotificationToastConfig(), ...this._defaultConfig, ...userConfig };
    const overlayRef = this._createOverlay(config);
    const container = this._attachNotificationToastContainer(overlayRef, config);
    const notificationRef = new SbbNotificationToastRef<T | EmbeddedViewRef<any>>(
      container,
      overlayRef,
    );

    if (content instanceof TemplateRef) {
      const portal = new TemplatePortal(content, null!, {
        $implicit: config.data,
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

    // Subscribe to the breakpoint observer and attach the notification-mobile class as
    // appropriate. This class is applied to the overlay element because the overlay must expand to
    // fill the width of the screen for full width notifications.
    this._breakpointObserver
      .observe(Breakpoints.MobileDevicePortrait)
      .pipe(takeUntil(overlayRef.detachments()))
      .subscribe((state) => {
        const classList = overlayRef.overlayElement.classList;
        state.matches
          ? classList.add(this._mobileDeviceCssClass)
          : classList.remove(this._mobileDeviceCssClass);
      });

    this._animateNotification(notificationRef, config);
    this._openedNotificationRef = notificationRef;
    return this._openedNotificationRef;
  }

  /** Animates the old notification toast out and the new one in. */
  private _animateNotification(
    notificationRef: SbbNotificationToastRef<any>,
    config: SbbNotificationToastConfig,
  ) {
    // When the notification toast is dismissed, clear the reference to it.
    notificationRef.afterDismissed().subscribe(() => {
      // Clear the notification toast ref if it hasn't already been replaced by a newer notification toast.
      if (this._openedNotificationRef === notificationRef) {
        this._openedNotificationRef = null;
      }

      if (config.announcementMessage) {
        this._live.clear();
      }
    });

    if (this._openedNotificationRef) {
      // If a notification toast is already in view, dismiss it and enter the
      // new notification toast after exit animation is complete.
      this._openedNotificationRef.afterDismissed().subscribe(() => {
        notificationRef.containerInstance.enter();
      });
      this._openedNotificationRef.dismiss();
    } else {
      // If no notification toast is in view, enter the new notification toast.
      notificationRef.containerInstance.enter();
    }

    // If a dismiss timeout is provided, set up dismiss based on after the notification toast is opened.
    if (config.duration && config.duration > 0) {
      notificationRef
        .afterOpened()
        .subscribe(() => notificationRef._dismissAfter(config.duration!));
    }

    if (config.announcementMessage) {
      this._live.announce(config.announcementMessage, config.politeness);
    }
  }

  /**
   * Creates a new overlay and places it in the correct location.
   * @param config The user-specified notification toast config.
   */
  private _createOverlay(config: SbbNotificationToastConfig): OverlayRef {
    const overlayConfig = new OverlayConfig();
    const positionStrategy = this._overlay.position().global();

    // Set horizontal position.
    positionStrategy.centerHorizontally();

    // Set horizontal position.
    if (config.verticalPosition === 'top') {
      positionStrategy.top('0');
    } else {
      positionStrategy.bottom('0');
    }

    overlayConfig.positionStrategy = positionStrategy;
    return createOverlayRef(this._injector, overlayConfig);
  }

  /**
   * Creates an injector to be used inside of a notification toast component.
   * @param config Config that was used to create the notification toast.
   * @param notificationRef toastRef Reference to the notification toast.
   */
  private _createInjector<T>(
    config: SbbNotificationToastConfig,
    notificationRef: SbbNotificationToastRef<T>,
  ) {
    const userInjector = config?.viewContainerRef?.injector;

    return Injector.create({
      parent: userInjector || this._injector,
      providers: [
        { provide: SbbNotificationToastRef, useValue: notificationRef },
        { provide: SBB_NOTIFICATION_TOAST_DATA, useValue: config.data },
      ],
    });
  }
}

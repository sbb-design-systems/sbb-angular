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
  Type,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import {
  SbbNotificationToastConfig,
  SBB_NOTIFICATION_TOAST_DATA,
} from './notification-toast-config';
import { NotificationToastContainerComponent } from './notification-toast-container.component';
import { SbbNotificationToastRef } from './notification-toast-ref';
import { NotificationToastModule } from './notification-toast.module';
import {
  SimpleNotificationComponent,
  TextOnlyNotificationToast,
} from './simple-notification.component';

/** Injection token that can be used to specify default snack bar. */
export const SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS = new InjectionToken<
  SbbNotificationToastConfig
>('notification-default-options', {
  providedIn: 'root',
  factory: SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS_FACTORY,
});

/** @docs-private */
export function SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS_FACTORY(): SbbNotificationToastConfig {
  return new SbbNotificationToastConfig();
}

/**
 * Service to dispatch notification toast messages.
 */
@Injectable({ providedIn: NotificationToastModule })
export class SbbNotificationToast implements OnDestroy {
  /**
   * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
   * If there is a parent snack-bar service, all operations should delegate to that parent
   * via `_openedSnackBarRef`.
   */
  private _notificationRefAtThisLevel: SbbNotificationToastRef<any> | null = null;

  /** The component that should be rendered as the snack bar's simple component. */
  protected _simpleSnackBarComponent: Type<TextOnlyNotificationToast> = SimpleNotificationComponent;

  /** The container component that attaches the provided template or component. */
  protected _snackBarContainerComponent: Type<
    NotificationToastContainerComponent
  > = NotificationToastContainerComponent;

  /** The CSS class to applie for handset mode. */
  protected _handsetCssClass = 'mat-snack-bar-handset';

  /** Reference to the currently opened snackbar at *any* level. */
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

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _live: LiveAnnouncer,
    private _breakpointObserver: BreakpointObserver,
    @Optional() @SkipSelf() private _parentNotification: SbbNotificationToast,
    @Inject(SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS)
    private _defaultConfig: SbbNotificationToastConfig
  ) {}

  /**
   * Creates and dispatches a snack bar with a custom component for the content, removing any
   * currently opened snack bars.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromComponent<T>(
    component: ComponentType<T>,
    config?: SbbNotificationToastConfig
  ): SbbNotificationToastRef<T> {
    return this._attach(component, config) as SbbNotificationToastRef<T>;
  }

  /**
   * Creates and dispatches a snack bar with a custom template for the content, removing any
   * currently opened snack bars.
   *
   * @param template Template to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromTemplate(
    template: TemplateRef<any>,
    config?: SbbNotificationToastConfig
  ): SbbNotificationToastRef<EmbeddedViewRef<any>> {
    return this._attach(template, config);
  }

  /**
   * Opens a snackbar with a message and an optional action.
   * @param message The message to show in the snackbar.
   * @param action The label for the snackbar action.
   * @param config Additional configuration options for the snackbar.
   */
  open(
    message: string,
    config?: SbbNotificationToastConfig
  ): SbbNotificationToastRef<TextOnlyNotificationToast> {
    const mergedConfig = { ...this._defaultConfig, ...config };

    // Since the user doesn't have access to the component, we can
    // override the data to pass in our own message and action.
    mergedConfig.data = { message };

    // Since the snack bar has `role="alert"`, we don't
    // want to announce the same message twice.
    if (mergedConfig.announcementMessage === message) {
      mergedConfig.announcementMessage = undefined;
    }

    return this.openFromComponent(this._simpleSnackBarComponent, mergedConfig);
  }

  /**
   * Dismisses the currently-visible snack bar.
   */
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

  /**
   * Attaches the snack bar container component to the overlay.
   */
  private _attachNotificationToastContainer(
    overlayRef: OverlayRef,
    config: SbbNotificationToastConfig
  ): NotificationToastContainerComponent {
    const userInjector = config?.viewContainerRef?.injector;
    const injector = new PortalInjector(
      userInjector || this._injector,
      new WeakMap([[SbbNotificationToastConfig, config]])
    );

    const containerPortal = new ComponentPortal(
      this._snackBarContainerComponent,
      config.viewContainerRef,
      injector
    );
    const containerRef: ComponentRef<NotificationToastContainerComponent> = overlayRef.attach(
      containerPortal
    );
    containerRef.instance.config = config;
    return containerRef.instance;
  }

  /**
   * Places a new component or a template as the content of the snack bar container.
   */
  private _attach<T>(
    content: ComponentType<T> | TemplateRef<T>,
    userConfig?: SbbNotificationToastConfig
  ): SbbNotificationToastRef<T | EmbeddedViewRef<any>> {
    const config = { ...new SbbNotificationToastConfig(), ...this._defaultConfig, ...userConfig };
    const overlayRef = this._createOverlay(config);
    const container = this._attachNotificationToastContainer(overlayRef, config);
    const notificationRef = new SbbNotificationToastRef<T | EmbeddedViewRef<any>>(
      container,
      overlayRef
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

    // Subscribe to the breakpoint observer and attach the notification-handset class as
    // appropriate. This class is applied to the overlay element because the overlay must expand to
    // fill the width of the screen for full width notifications.
    this._breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(overlayRef.detachments()))
      .subscribe((state) => {
        const classList = overlayRef.overlayElement.classList;
        state.matches
          ? classList.add(this._handsetCssClass)
          : classList.remove(this._handsetCssClass);
      });

    this._animateNotification(notificationRef, config);
    this._openedNotificationRef = notificationRef;
    return this._openedNotificationRef;
  }

  /** Animates the old snack bar out and the new one in. */
  private _animateNotification(
    notificationRef: SbbNotificationToastRef<any>,
    config: SbbNotificationToastConfig
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
   * @param config The user-specified snack bar config.
   */
  private _createOverlay(config: SbbNotificationToastConfig): OverlayRef {
    const overlayConfig = new OverlayConfig();
    overlayConfig.direction = 'ltr';

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
    return this._overlay.create(overlayConfig);
  }

  /**
   * Creates an injector to be used inside of a snack bar component.
   * @param config Config that was used to create the snack bar.
   * @param snackBarRef Reference to the snack bar.
   */
  private _createInjector<T>(
    config: SbbNotificationToastConfig,
    notificationRef: SbbNotificationToastRef<T>
  ): PortalInjector {
    const userInjector = config?.viewContainerRef?.injector;

    return new PortalInjector(
      userInjector || this._injector,
      new WeakMap<any, any>([
        [SbbNotificationToastRef, notificationRef],
        [SBB_NOTIFICATION_TOAST_DATA, config.data],
      ])
    );
  }
}

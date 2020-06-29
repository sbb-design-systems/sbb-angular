import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
  HostBinding,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { NotificationConfig } from '../notification/notification-config';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn',
}

@Component({
  selector: 'sbb-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
  // In Ivy embedded views will be change detected from their declaration place, rather than
  // where they were stamped out. This means that we can't have the notification container be OnPush,
  // because it might cause notifications that were opened from a template not to be out of date.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class NotificationContainerComponent extends BasePortalOutlet implements OnDestroy {
  private _destroyed = false;
  /** @docs-private */
  @HostBinding('class.sbb-notification')
  baseCssClass = true;

  /** @docs-private */
  @HostBinding('class.sbb-notification-success')
  get typeSuccess(): boolean {
    return this.config.type === NotificationType.SUCCESS;
  }

  /** @docs-private */
  @HostBinding('class.sbb-notification-info')
  get typeInfo(): boolean {
    return this.config.type === NotificationType.INFO;
  }

  /** @docs-private */
  @HostBinding('class.sbb-notification-error')
  get typeError(): boolean {
    return this.config.type === NotificationType.ERROR;
  }

  /** @docs-private */
  @HostBinding('class.sbb-notification-warn')
  get typeWarn(): boolean {
    return this.config.type === NotificationType.WARN;
  }

  @HostBinding('attr.aria-hidden') ariaHidden: 'false' | 'true';

  @HostBinding('hidden')
  get hidden() {
    return this.ariaHidden === 'true';
  }

  /** @docs-private */
  @HostBinding('class.sbb-notification-has-jump-marks')
  get hasJumpMarks() {
    return this.config.jumpMarks && this.config.jumpMarks.length;
  }

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;
  set icon(notificationIcon: TemplateRef<any> | null) {
    this._icon = notificationIcon;
  }

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
    if (this._icon) {
      return this._icon;
    }
    switch (this.config.type) {
      case NotificationType.SUCCESS:
        return this.checkIcon;
      case NotificationType.ERROR:
      case NotificationType.WARN:
        return this.errorIcon;
      case NotificationType.INFO:
        return this.infoIcon;
      default:
        return null;
    }
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }

  get readonly() {
    return this._readonly;
  }

  private _readonly = false;

  type: 'success' | 'info' | 'error' | 'warn' = NotificationType.SUCCESS;

  readonly _onExit: Subject<any> = new Subject();
  readonly _onEnter: ReplaySubject<any> = new ReplaySubject();
  private _icon: TemplateRef<any> | null;

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    public config: NotificationConfig
  ) {
    super();
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

  exit(): Observable<void> {
    this.ariaHidden = 'true';
    this._completeExit();

    return this._onExit;
  }

  enter(): void {
    if (!this._destroyed) {
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

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
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { NotificationConfig } from '../notification/notification-config';

@Component({
  selector: 'sbb-notification-container',
  template: `<ng-template cdkPortalOutlet></ng-template>`,
  // In Ivy embedded views will be change detected from their declaration place, rather than
  // where they were stamped out. This means that we can't have the notification container be OnPush,
  // because it might cause notifications that were opened from a template not to be out of date.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class NotificationContainerComponent extends BasePortalOutlet implements OnDestroy {
  private _destroyed = false;

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  readonly _onExit: Subject<any> = new Subject();

  readonly _onEnter: ReplaySubject<any> = new ReplaySubject();

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    public notificationConfig: NotificationConfig
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
    this._elementRef.nativeElement.setAttribute('exit', '');

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
    this._ngZone.onMicrotaskEmpty
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this._onExit.next();
        this._onExit.complete();
      });
  }

  private _applyNotificationClasses() {
    const element: HTMLElement = this._elementRef.nativeElement;
    const panelClasses = this.notificationConfig.panelClass;

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

    if (this.notificationConfig.verticalPosition === 'top') {
      element.classList.add('notification-top');
    }
  }

  private _assertNotAttached() {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Attempting to attach notification content after content is already attached');
    }
  }
}

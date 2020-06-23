import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import {
  IconCircleInformationModule,
  IconCrossModule,
  IconSignExclamationPointModule,
  IconTickModule,
} from '@sbb-esta/angular-icons';

import { NotificationContainerComponent } from '../notification-container/notification-container.component';

import { NotificationConfig } from './notification-config';
import { NotificationComponent, NotificationType } from './notification.component';
import { Notification, NOTIFICATION_CONFIG } from './notification.service';
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

@Component({
  selector: 'sbb-notification-mock',
  template: '',
})
export class NotificationMockComponent {
  dismissed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _notification: Notification) {}

  jumpmarks = [
    { elementId: '#tip1', title: 'Tip 1' },
    { elementId: '#tip2', title: 'Tip 2' },
  ];

  showNotification(config: NotificationConfig) {
    this._notification
      .open(config.message || 'test', {
        jumpMarks: config.jumpMarks,
        type: config.type,
        icon: config.icon,
        readonly: config.readonly,
        verticalPosition: config.verticalPosition,
        message: config.message,
      })
      .afterDismissed()
      .subscribe(() => this.dismissed.emit());
  }
}

describe('NotificationComponent', () => {
  describe('core', () => {
    let component: NotificationComponent;
    let fixture: ComponentFixture<NotificationComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          IconCrossModule,
          IconTickModule,
          IconSignExclamationPointModule,
          IconCircleInformationModule,
          IconDirectiveModule,
          PortalModule,
          OverlayModule,
        ],
        declarations: [NotificationComponent, NotificationContainerComponent],
        providers: [Notification, { provide: NOTIFICATION_CONFIG, useValue: NotificationConfig }],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(NotificationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    let testFixture: ComponentFixture<NotificationMockComponent>;
    let testComponent: NotificationMockComponent;
    let overlayContainerElement: HTMLElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          IconCrossModule,
          IconTickModule,
          IconSignExclamationPointModule,
          IconCircleInformationModule,
          IconDirectiveModule,
          PortalModule,
          OverlayModule,
        ],
        declarations: [
          NotificationComponent,
          NotificationMockComponent,
          NotificationContainerComponent,
        ],
        providers: [
          Notification,
          { provide: NOTIFICATION_CONFIG, useValue: NotificationConfig },
          {
            provide: OverlayContainer,
            useFactory: () => {
              overlayContainerElement = document.createElement('div');
              return { getContainerElement: () => overlayContainerElement };
            },
          },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      testFixture = TestBed.createComponent(NotificationMockComponent);
      testComponent = testFixture.componentInstance;
      testFixture.detectChanges();
    });

    it('should have error icon when type is ERROR', () => {
      testComponent.showNotification({ type: NotificationType.ERROR });
      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-error');
      expect(notifications.length).toBe(1);
      const icons = notifications[0].querySelectorAll('sbb-icon-sign-exclamation-point');
      expect(icons.length).toBe(1);
    });

    it('should have tick icon when type is SUCCESS', () => {
      testComponent.showNotification({ type: NotificationType.SUCCESS });
      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-success');
      expect(notifications.length).toBe(1);
      const icons = notifications[0].querySelectorAll('sbb-icon-tick');
      expect(icons.length).toBe(1);
    });

    it('should have info icon when type is INFO', () => {
      testComponent.showNotification({ type: NotificationType.INFO });
      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-info');
      expect(notifications.length).toBe(1);
      const icons = notifications[0].querySelectorAll('sbb-icon-circle-information');
      expect(icons.length).toBe(1);
    });

    it('should have warn icon when type is WARN', () => {
      testComponent.showNotification({ type: NotificationType.WARN });
      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-warn');
      expect(notifications.length).toBe(1);
      const icons = notifications[0].querySelectorAll('sbb-icon-sign-exclamation-point');
      expect(icons.length).toBe(1);
    });

    it('should house jump marks', () => {
      testComponent.showNotification({
        jumpMarks: [
          { elementId: '#here', title: 'Here' },
          { elementId: '#there', title: 'There' },
        ],
      });

      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-jump-mark');
      expect(notifications.length).toBe(2);
    });

    it('should emit when closing notification', () => {
      const dismissedSpy: Spy = spyOn(testComponent.dismissed, 'emit');
      testComponent.showNotification({ readonly: false });
      testFixture.detectChanges();
      const closeButton = overlayContainerElement.querySelector(
        '.sbb-notification-icon-close-wrapper'
      ) as HTMLElement;

      expect(closeButton).toBeDefined();
      expect(closeButton).not.toBeNull();
      closeButton.click();
      testFixture.whenStable().then(() => {
        expect(dismissedSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should call callback of jump mark', () => {
      const callbackMock = createSpy('mock-callback');
      testComponent.showNotification({
        jumpMarks: [{ callback: callbackMock, title: 'Here' }],
      });
      testFixture.detectChanges();
      const notificationLinkContainer = overlayContainerElement.querySelector(
        '.sbb-notification-jump-mark'
      ) as HTMLElement;
      expect(notificationLinkContainer).toBeDefined();
      expect(notificationLinkContainer).not.toBeNull();
      const notificationLink = notificationLinkContainer.firstChild as HTMLElement;
      notificationLink.click();
      expect(callbackMock).toHaveBeenCalled();
    });
  });
});

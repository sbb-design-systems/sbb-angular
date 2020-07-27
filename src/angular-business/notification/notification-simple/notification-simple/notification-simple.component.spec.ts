import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import {
  IconCircleInformationModule,
  IconCrossModule,
  IconSignExclamationPointModule,
  IconTickModule,
} from '@sbb-esta/angular-icons';

import { NotificationSimpleContainerComponent } from '../notification-simple-container/notification-simple-container.component';

import { NotificationSimpleConfig } from './notification-simple-config';
import { NotificationSimpleComponent } from './notification-simple.component';
import { Notification, NOTIFICATION_CONFIG } from './notification-simple.service';
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

  showNotification(config: NotificationSimpleConfig) {
    this._notification
      .open(config.announcementMessage || 'test', {
        type: config.type,
        verticalPosition: config.verticalPosition,
        announcementMessage: config.announcementMessage,
      })
      .afterDismissed()
      .subscribe(() => this.dismissed.emit());
  }
}

describe('NotificationComponent', () => {
  describe('core', () => {
    let component: NotificationSimpleComponent;
    let fixture: ComponentFixture<NotificationSimpleComponent>;

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
          NoopAnimationsModule,
        ],
        declarations: [NotificationSimpleComponent, NotificationSimpleContainerComponent],
        providers: [
          Notification,
          { provide: NOTIFICATION_CONFIG, useValue: NotificationSimpleConfig },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(NotificationSimpleComponent);
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
          NoopAnimationsModule,
        ],
        declarations: [
          NotificationSimpleComponent,
          NotificationMockComponent,
          NotificationSimpleContainerComponent,
        ],
        providers: [
          Notification,
          { provide: NOTIFICATION_CONFIG, useValue: NotificationSimpleConfig },
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
      testComponent.showNotification({ type: 'error' });
      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-error');
      expect(notifications.length).toBe(1);
      const icons = notifications[0].querySelectorAll('sbb-icon-sign-exclamation-point');
      expect(icons.length).toBe(1);
    });

    it('should have tick icon when type is SUCCESS', () => {
      testComponent.showNotification({ type: 'success' });
      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-success');
      expect(notifications.length).toBe(1);
      const icons = notifications[0].querySelectorAll('sbb-icon-tick');
      expect(icons.length).toBe(1);
    });

    it('should have info icon when type is INFO', () => {
      testComponent.showNotification({ type: 'info' });
      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-info');
      expect(notifications.length).toBe(1);
      const icons = notifications[0].querySelectorAll('sbb-icon-circle-information');
      expect(icons.length).toBe(1);
    });

    it('should have warn icon when type is WARN', () => {
      testComponent.showNotification({ type: 'warn' });
      testFixture.detectChanges();
      const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-warn');
      expect(notifications.length).toBe(1);
      const icons = notifications[0].querySelectorAll('sbb-icon-sign-exclamation-point');
      expect(icons.length).toBe(1);
    });

    it('should emit when closing notification', () => {
      const dismissedSpy: Spy = spyOn(testComponent.dismissed, 'emit');
      testComponent.showNotification({});
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

    it('should close automatically after set duration', () => {
      const dismissedSpy: Spy = spyOn(testComponent.dismissed, 'emit');
      testComponent.showNotification({ duration: 250 });
      setTimeout(() => {
        testFixture.detectChanges();
        expect(dismissedSpy).toHaveBeenCalledTimes(1);
      }, 300);
    });
  });
});

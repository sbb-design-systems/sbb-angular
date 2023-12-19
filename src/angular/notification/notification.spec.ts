import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { switchToLean } from '@sbb-esta/angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbNotification, SbbNotificationModule, SbbNotificationType } from './index';

describe('SbbNotification', () => {
  describe('core', () => {
    let component: SbbNotification;
    let fixture: ComponentFixture<SbbNotification>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, SbbNotificationModule, SbbIconModule, SbbIconTestingModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SbbNotification);
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

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          NoopAnimationsModule,
          SbbNotificationModule,
          SbbIconModule,
          SbbIconTestingModule,
        ],
        declarations: [NotificationMockComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      testFixture = TestBed.createComponent(NotificationMockComponent);
      testComponent = testFixture.componentInstance;
      testFixture.detectChanges();
    });

    it('should have red background when type is ERROR', async () => {
      testComponent.type = 'error';
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-error'));
      expect(notifications.length).toBeGreaterThan(0);
      await testFixture.whenRenderingDone();
      const styles = getComputedStyle(notifications[0].nativeElement);
      expect(styles.getPropertyValue('background-color')).toBe('rgb(235, 0, 0)');
    });

    it('should have grey background when type is SUCCESS', async () => {
      testComponent.type = 'success';
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-success'));
      expect(notifications.length).toBeGreaterThan(0);
      await testFixture.whenRenderingDone();
      const styles = getComputedStyle(notifications[0].nativeElement);
      expect(styles.getPropertyValue('background-color')).toBe('rgb(104, 104, 104)');
    });

    it('should have grey background when type is INFO', async () => {
      testComponent.type = 'info';
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-info'));
      expect(notifications.length).toBeGreaterThan(0);
      await testFixture.whenRenderingDone();
      const styles = getComputedStyle(notifications[0].nativeElement);
      expect(styles.getPropertyValue('background-color')).toBe('rgb(104, 104, 104)');
    });

    it('should change height with jump marks', async () => {
      const componentStyles = getComputedStyle(
        testFixture.debugElement.query(By.css('.sbb-notification')).nativeElement,
      );
      expect(componentStyles.getPropertyValue('height')).toBe('68px');

      testComponent.jumpMarks = [
        { elementId: '#here', title: 'Here' },
        { elementId: '#there', title: 'There' },
      ];
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(
        By.css('.sbb-notification-jump-mark'),
      );
      expect(notifications.length).toBeGreaterThan(0);
      await testFixture.whenRenderingDone();
      expect(componentStyles.getPropertyValue('height')).toBe('92px');
    });

    it('should call callback of jump mark', () => {
      const callbackMock = jasmine.createSpy('mock-callback');
      testComponent.jumpMarks = [{ callback: callbackMock, title: 'Here' }];
      testFixture.detectChanges();
      const notificationLink = testFixture.debugElement.query(
        By.css('.sbb-notification-jump-mark > a'),
      );
      notificationLink.triggerEventHandler('click', {
        preventDefault: jasmine.createSpy('prevent-default-mock'),
      });
      expect(callbackMock).toHaveBeenCalled();
    });

    describe('lean', () => {
      switchToLean();

      it('should have red background when type is ERROR', async () => {
        testComponent.type = 'error';
        testFixture.detectChanges();
        const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-error'));
        expect(notifications.length).toBeGreaterThan(0);
        await testFixture.whenRenderingDone();
        const styles = getComputedStyle(notifications[0].nativeElement);
        expect(styles.getPropertyValue('background-color')).toBe('rgb(235, 0, 0)');
      });

      it('should have grey background when type is SUCCESS', async () => {
        testComponent.type = 'success';
        testFixture.detectChanges();
        const notifications = testFixture.debugElement.queryAll(
          By.css('.sbb-notification-success'),
        );
        expect(notifications.length).toBeGreaterThan(0);
        await testFixture.whenRenderingDone();
        const styles = getComputedStyle(notifications[0].nativeElement);
        expect(styles.getPropertyValue('background-color')).toBe('rgb(255, 255, 255)');
      });

      it('should have grey background when type is INFO', async () => {
        testComponent.type = 'info';
        testFixture.detectChanges();
        const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-info'));
        expect(notifications.length).toBeGreaterThan(0);
        await testFixture.whenRenderingDone();
        const styles = getComputedStyle(notifications[0].nativeElement);
        expect(styles.getPropertyValue('background-color')).toBe('rgb(255, 255, 255)');
      });

      it('should have peach colored background when type is WARN', async () => {
        testComponent.type = 'warn';
        testFixture.detectChanges();
        const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-warn'));
        expect(notifications.length).toBeGreaterThan(0);
        await testFixture.whenRenderingDone();
        const styles = getComputedStyle(notifications[0].nativeElement);
        expect(styles.getPropertyValue('background-color')).toBe('rgb(252, 187, 0)');
      });

      it('should have white background and granite color when type is INFO-LIGHT', async () => {
        testComponent.type = 'info-light';
        testFixture.detectChanges();
        const notifications = testFixture.debugElement.queryAll(
          By.css('.sbb-notification-info-light'),
        );
        expect(notifications.length).toBeGreaterThan(0);
        await testFixture.whenRenderingDone();
        const styles = getComputedStyle(notifications[0].nativeElement);
        const iconStyles = getComputedStyle(
          notifications[0].queryAll(By.css('.sbb-icon'))[0].nativeElement,
        );
        expect(styles.getPropertyValue('background-color')).toBe('rgb(255, 255, 255)');
        expect(styles.getPropertyValue('color')).toBe('rgb(104, 104, 104)');
        expect(iconStyles.getPropertyValue('color')).toBe('rgb(104, 104, 104)');
      });

      it('should change height with jump marks', async () => {
        const componentStyles = getComputedStyle(
          testFixture.debugElement.query(By.css('.sbb-notification')).nativeElement,
        );
        expect(componentStyles.getPropertyValue('height')).toBe('48px');

        testComponent.jumpMarks = [
          { elementId: '#here', title: 'Here' },
          { elementId: '#there', title: 'There' },
        ];
        testFixture.detectChanges();
        const notifications = testFixture.debugElement.queryAll(
          By.css('.sbb-notification-jump-mark'),
        );
        expect(notifications.length).toBeGreaterThan(0);
        await testFixture.whenRenderingDone();
        expect(componentStyles.getPropertyValue('height')).toBe('72.5px');
      });

      it('should emit when closing notification', fakeAsync(() => {
        const dismissedSpy = spyOn(testComponent, 'dismissed');
        testComponent.readonly = false;
        testFixture.detectChanges();
        const closeButton = testFixture.nativeElement.querySelector(
          '.sbb-notification-dismiss-icon-button',
        ) as HTMLElement;

        expect(closeButton).toBeDefined();
        expect(closeButton).not.toBeNull();
        closeButton.click();
        testFixture.detectChanges();
        flush();
        testFixture.detectChanges();
        const notification: SbbNotification = testFixture.debugElement.query(
          By.directive(SbbNotification),
        ).componentInstance;
        expect(dismissedSpy).toHaveBeenCalledTimes(1);
        expect(dismissedSpy).toHaveBeenCalledWith({ notification });
      }));
    });
  });
});

@Component({
  selector: 'sbb-notification-mock',
  template:
    '<sbb-notification [type]="type" [jumpMarks]="jumpMarks" (dismissed)="dismissed($event)" [readonly]="readonly">{{message}}</sbb-notification>',
})
export class NotificationMockComponent {
  message = 'Search';
  type: SbbNotificationType = 'success';
  title: string;
  readonly = true;
  jumpMarks: any[] = [];

  dismissed(_event: any) {}
}

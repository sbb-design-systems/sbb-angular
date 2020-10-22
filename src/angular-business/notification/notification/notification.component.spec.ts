import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

import { SbbNotification } from './notification.component';

@Component({
  selector: 'sbb-notification-mock',
  template:
    '<sbb-notification [type]="type" [jumpMarks]="jumpMarks" (dismissed)="dismissed($event)" [readonly]="readonly">{{message}}</sbb-notification>',
})
export class NotificationMockComponent {
  message = 'Search';
  type: 'success' | 'error' | 'info' | 'warn' = 'success';
  title: string;
  readonly = true;
  jumpMarks: any[] = [];

  dismissed(_event: any) {}
}

describe('SbbNotification', () => {
  describe('core', () => {
    let component: SbbNotification;
    let fixture: ComponentFixture<SbbNotification>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, SbbIconModule, SbbIconTestingModule],
        declarations: [SbbNotification],
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

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, SbbIconModule, SbbIconTestingModule],
        declarations: [SbbNotification, NotificationMockComponent],
      }).compileComponents();
    }));

    beforeEach(() => {
      testFixture = TestBed.createComponent(NotificationMockComponent);
      testComponent = testFixture.componentInstance;
      testFixture.detectChanges();
    });

    it('should have red background when type is ERROR', () => {
      testComponent.type = 'error';
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-error'));
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        const styles = window.getComputedStyle(notifications[0].nativeElement);
        expect(styles.backgroundColor).toBe('rgb(235, 0, 0)');
      });
    });

    it('should have grey background when type is SUCCESS', () => {
      testComponent.type = 'success';
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-success'));
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        const styles = window.getComputedStyle(notifications[0].nativeElement);
        expect(styles.backgroundColor).toBe('rgb(255, 255, 255)');
      });
    });

    it('should have grey background when type is INFO', () => {
      testComponent.type = 'info';
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-info'));
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        const styles = window.getComputedStyle(notifications[0].nativeElement);
        expect(styles.backgroundColor).toBe('rgb(255, 255, 255)');
      });
    });

    it('should have grey background when type is WARN', () => {
      testComponent.type = 'warn';
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-warn'));
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        const styles = window.getComputedStyle(notifications[0].nativeElement);
        expect(styles.backgroundColor).toBe('rgb(242, 126, 0)');
      });
    });

    it('should change height with jump marks', () => {
      const componentStyles = window.getComputedStyle(testFixture.debugElement.nativeElement);
      expect(componentStyles.height).toBe('51px');

      testComponent.jumpMarks = [
        { elementId: '#here', title: 'Here' },
        { elementId: '#there', title: 'There' },
      ];
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(
        By.css('.sbb-notification-jump-mark')
      );
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        expect(componentStyles.height).toBe('72px');
      });
    });

    it('should emit when closing notification', () => {
      const dismissedSpy: Spy = spyOn(testComponent, 'dismissed');
      testComponent.readonly = false;
      testFixture.detectChanges();
      const closeButton = testFixture.nativeElement.querySelector(
        '.sbb-notification-icon-close-wrapper'
      ) as HTMLElement;

      expect(closeButton).toBeDefined();
      expect(closeButton).not.toBeNull();
      closeButton.click();
      testFixture.whenStable().then(() => {
        expect(dismissedSpy).toHaveBeenCalledTimes(1);
        expect(dismissedSpy).toHaveBeenCalledWith(false);
      });
    });

    it('should call callback of jump mark', () => {
      const callbackMock = createSpy('mock-callback');
      testComponent.jumpMarks = [{ callback: callbackMock, title: 'Here' }];
      testFixture.detectChanges();
      const notificationLink = testFixture.debugElement.query(
        By.css('.sbb-notification-jump-mark > a')
      );
      notificationLink.triggerEventHandler('click', {
        preventDefault: createSpy('prevent-default-mock'),
      });
      expect(callbackMock).toHaveBeenCalled();
    });
  });
});

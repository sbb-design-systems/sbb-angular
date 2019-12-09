import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { configureTestSuite } from 'ng-bullet';

import { NotificationComponent, NotificationType } from './notification.component';
import createSpy = jasmine.createSpy;

@Component({
  selector: 'sbb-notification-mock',
  template:
    '<sbb-notification [message]="message" [type]="type" [jumpMarks]="jumpMarks"></sbb-notification>'
})
export class NotificationMockComponent {
  message = 'Suchen';
  type = NotificationType.SUCCESS;
  jumpMarks = [];
}

describe('NotificationComponent', () => {
  describe('core', () => {
    let component: NotificationComponent;
    let fixture: ComponentFixture<NotificationComponent>;

    configureTestSuite(() => {
      TestBed.configureTestingModule({
        imports: [IconCollectionModule, CommonModule],
        declarations: [NotificationComponent]
      });
    });

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

    configureTestSuite(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, IconCollectionModule],
        declarations: [NotificationComponent, NotificationMockComponent]
      });
    });

    beforeEach(() => {
      testFixture = TestBed.createComponent(NotificationMockComponent);
      testComponent = testFixture.componentInstance;
      testFixture.detectChanges();
    });

    it('should have red background when type is ERROR', () => {
      testComponent.type = NotificationType.ERROR;
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-error'));
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        const styles = window.getComputedStyle(notifications[0].nativeElement);
        expect(styles.backgroundColor).toBe('rgb(235, 0, 0)');
      });
    });

    it('should have grey background when type is SUCCESS', () => {
      testComponent.type = NotificationType.SUCCESS;
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-success'));
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        const styles = window.getComputedStyle(notifications[0].nativeElement);
        expect(styles.backgroundColor).toBe('rgb(102, 102, 102)');
      });
    });

    it('should have grey background when type is INFO', () => {
      testComponent.type = NotificationType.INFO;
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(By.css('.sbb-notification-info'));
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        const styles = window.getComputedStyle(notifications[0].nativeElement);
        expect(styles.backgroundColor).toBe('rgb(102, 102, 102)');
      });
    });

    it('should change height with jump marks', () => {
      const componentStyles = window.getComputedStyle(testFixture.debugElement.nativeElement);
      expect(componentStyles.height).toBe('68px');

      testComponent.jumpMarks = [
        { elementId: '#here', title: 'Here' },
        { elementId: '#there', title: 'There' }
      ];
      testFixture.detectChanges();
      const notifications = testFixture.debugElement.queryAll(
        By.css('.sbb-notification-jump-mark')
      );
      expect(notifications.length).toBeGreaterThan(0);
      testFixture.whenRenderingDone().then(() => {
        expect(componentStyles.height).toBe('92px');
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
        preventDefault: createSpy('prevent-default-mock')
      });
      expect(callbackMock).toHaveBeenCalled();
    });
  });
});

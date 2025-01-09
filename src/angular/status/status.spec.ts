import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbStatusModule } from './status.module';

@Component({
  template: '<sbb-status type="valid"></sbb-status>',
  imports: [SbbStatusModule],
})
class ValidStatusComponent {}
@Component({
  template: '<sbb-status type="warning"></sbb-status>',
  imports: [SbbStatusModule],
})
class WarningStatusComponent {}
@Component({
  template: '<sbb-status type="invalid"></sbb-status>',
  imports: [SbbStatusModule],
})
class InvalidStatusComponent {}

@Component({
  template: '<sbb-status type="valid" [message]="message"></sbb-status>',
  imports: [SbbStatusModule],
})
class StatusWithMessageComponent {
  message = 'test message';
}

@Component({
  template: '<sbb-status type="valid" aria-label="Test"></sbb-status>',
  imports: [SbbStatusModule],
})
class StatusWithAriaLabelComponent {}

describe('SbbStatus', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule],
    });
  }));

  describe('valid', () => {
    let fixture: ComponentFixture<ValidStatusComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ValidStatusComponent);
      fixture.detectChanges();
    });

    it('should have tick icon', () => {
      const element = fixture.debugElement.query(
        By.css('sbb-icon[svgIcon="tick-small"]'),
      ).nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have the correct class on the wrapper div', () => {
      const element = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-valid'),
      ).nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have green background', () => {
      const element: HTMLElement = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-valid'),
      ).nativeElement;
      expect(getComputedStyle(element).getPropertyValue('background-color')).toBe(
        'rgb(0, 151, 59)',
      );
    });
  });

  describe('warning', () => {
    let fixture: ComponentFixture<WarningStatusComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(WarningStatusComponent);
      fixture.detectChanges();
    });

    it('should have exclamation point icon', () => {
      const element = fixture.debugElement.query(
        By.css('sbb-icon[svgIcon="sign-exclamation-point-small"]'),
      ).nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have the correct class on the wrapper div', () => {
      const element = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-warning'),
      ).nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have peach background', () => {
      const element: HTMLElement = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-warning'),
      ).nativeElement;
      expect(getComputedStyle(element).getPropertyValue('background-color')).toBe(
        'rgb(252, 187, 0)',
      );
    });
  });

  describe('valid', () => {
    let fixture: ComponentFixture<InvalidStatusComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(InvalidStatusComponent);
      fixture.detectChanges();
    });

    it('should have cross icon', () => {
      const element = fixture.debugElement.query(
        By.css('sbb-icon[svgIcon="circle-cross-small"]'),
      ).nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have the correct class on the wrapper div', () => {
      const element = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-invalid'),
      ).nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have green background', () => {
      const element: HTMLElement = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-invalid'),
      ).nativeElement;
      expect(getComputedStyle(element).getPropertyValue('background-color')).toBe('rgb(235, 0, 0)');
    });
  });

  describe('message', () => {
    let component: StatusWithMessageComponent;
    let fixture: ComponentFixture<StatusWithMessageComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(StatusWithMessageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have the correct message', () => {
      const element: HTMLElement = fixture.debugElement.query(
        By.css('.sbb-status-message'),
      ).nativeElement;
      expect(element.textContent).toEqual(component.message);
    });
  });

  describe('aria-label', () => {
    let fixture: ComponentFixture<StatusWithAriaLabelComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(StatusWithAriaLabelComponent);
      fixture.detectChanges();
    });

    it('should move the aria-label', () => {
      const statusElement: HTMLElement = fixture.debugElement.query(
        By.css('sbb-status'),
      ).nativeElement;
      expect(statusElement.getAttribute('aria-label')).toBeNull();
      const iconWrapperElement: HTMLElement = fixture.debugElement.query(
        By.css('.sbb-status-icon'),
      ).nativeElement;
      expect(iconWrapperElement.getAttribute('aria-label')).toEqual('Test');
    });
  });
});

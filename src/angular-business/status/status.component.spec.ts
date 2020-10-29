import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';

import { SbbStatusModule } from './status.module';

@Component({
  template: '<sbb-status type="valid"></sbb-status>',
})
class ValidStatusComponent {}
@Component({
  template: '<sbb-status type="warning"></sbb-status>',
})
class WarningStatusComponent {}
@Component({
  template: '<sbb-status type="invalid"></sbb-status>',
})
class InvalidStatusComponent {}

@Component({
  template: '<sbb-status type="valid" [message]="message"></sbb-status>',
})
class StatusWithMessageComponent {
  message = 'test message';
}

@Component({
  template: '<sbb-status type="valid" aria-label="Test"></sbb-status>',
})
class StatusWithAriaLabelComponent {}

describe('SbbStatus', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ValidStatusComponent,
        WarningStatusComponent,
        InvalidStatusComponent,
        StatusWithMessageComponent,
        StatusWithAriaLabelComponent,
      ],
      imports: [SbbStatusModule, SbbIconTestingModule],
    }).compileComponents();
  }));

  describe('valid', () => {
    let fixture: ComponentFixture<ValidStatusComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ValidStatusComponent);
      fixture.detectChanges();
    });

    it('should have tick icon', () => {
      const element = fixture.debugElement.query(By.css('sbb-icon[svgIcon="kom:tick-small"]'))
        .nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have the correct class on the wrapper div', () => {
      const element = fixture.debugElement.query(By.css('.sbb-status-icon.sbb-status-icon-valid'))
        .nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have green background', () => {
      const element: HTMLElement = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-valid')
      ).nativeElement;
      expect(getComputedStyle(element).getPropertyValue('background-color')).toBe(
        'rgb(0, 151, 59)'
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
        By.css('sbb-icon[svgIcon="kom:exclamation-point-small"]')
      ).nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have the correct class on the wrapper div', () => {
      const element = fixture.debugElement.query(By.css('.sbb-status-icon.sbb-status-icon-warning'))
        .nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have orange background', () => {
      const element: HTMLElement = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-warning')
      ).nativeElement;
      expect(getComputedStyle(element).getPropertyValue('background-color')).toBe(
        'rgb(242, 126, 0)'
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
      const element = fixture.debugElement.query(By.css('sbb-icon[svgIcon="kom:cross-small"]'))
        .nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have the correct class on the wrapper div', () => {
      const element = fixture.debugElement.query(By.css('.sbb-status-icon.sbb-status-icon-invalid'))
        .nativeElement;
      expect(element).toBeTruthy();
    });

    it('should have green background', () => {
      const element: HTMLElement = fixture.debugElement.query(
        By.css('.sbb-status-icon.sbb-status-icon-invalid')
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
      const element: HTMLElement = fixture.debugElement.query(By.css('.sbb-status-message'))
        .nativeElement;
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
      const statusElement: HTMLElement = fixture.debugElement.query(By.css('sbb-status'))
        .nativeElement;
      expect(statusElement.getAttribute('aria-label')).toBeNull();
      const iconWrapperElement: HTMLElement = fixture.debugElement.query(By.css('.sbb-status-icon'))
        .nativeElement;
      expect(iconWrapperElement.getAttribute('aria-label')).toEqual('Test');
    });
  });
});

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbAlert, SbbAlertModule, SbbAlertOutlet, SbbAlertService } from './index';

describe('SbbAlert', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        SbbIconTestingModule,
        SbbAlertModule,
        AlertSimple,
        AlertRouterLink,
        AlertExternalLink,
      ],
    }).compileComponents();
  }));

  describe('normal variant', () => {
    let fixture: ComponentFixture<AlertSimple>;
    let component: AlertSimple;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(AlertSimple);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement.query(By.css('sbb-alert'));

      fixture.detectChanges();
    });

    it('should bind proper accessibility attributes', () => {
      expect(debugElement.nativeElement.getAttribute('role')).toEqual('alert');
    });

    it('should have the info default icon', () => {
      const icon = debugElement.query(By.css('.sbb-alert-icon sbb-icon'));
      expect(icon.componentInstance.svgIcon).toEqual('info');
    });

    it('should display the given icon', () => {
      component.icon = 'disruption';
      fixture.detectChanges();
      const icon = debugElement.query(By.css('.sbb-alert-icon sbb-icon'));
      expect(icon.componentInstance.svgIcon).toEqual('disruption');
    });

    it('should have "TEST" as message', () => {
      const alertMessage = debugElement.query(By.css('.sbb-alert-content')).nativeElement.innerText;
      expect(alertMessage).toBe('TEST');
    });

    it('should delete the alert on close button click', async () => {
      const closeButton = debugElement.query(By.css('.sbb-alert-close-button'));

      spyOn(component, 'dismissed');

      closeButton.nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      const alert: SbbAlert = debugElement.componentInstance;
      expect(alert._closed).toBe(true);
      expect(component.dismissed).toHaveBeenCalled();
    });
  });

  describe('router link variant', () => {
    let fixture: ComponentFixture<AlertRouterLink>;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(AlertRouterLink);
      debugElement = fixture.debugElement.query(By.css('a.sbb-alert'));

      fixture.detectChanges();
    });

    it('should have the correct href', () => {
      const linkHref = debugElement.nativeElement.getAttribute('href');
      expect(linkHref).toBe('/test?param1=val1#frag1');
    });
  });

  describe('external link variant', () => {
    let fixture: ComponentFixture<AlertExternalLink>;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(AlertExternalLink);
      debugElement = fixture.debugElement.query(By.css('a.sbb-alert'));

      fixture.detectChanges();
    });

    it('should have the correct href', () => {
      const linkHref = debugElement.nativeElement.getAttribute('href');
      expect(linkHref).toBe('https://sbb.ch');
    });
  });
});

describe('SbbAlertOutlet', () => {
  describe('', () => {
    let fixture: ComponentFixture<AlertOutletSimple>;
    let alertService: SbbAlertService;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbAlertModule, AlertOutletSimple, NoopAnimationsModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AlertOutletSimple);
      alertService = fixture.componentInstance.alertService;

      fixture.detectChanges();
    });

    it('should bind proper accessibility attributes', () => {
      const element = fixture.debugElement.query(By.directive(SbbAlertOutlet)).nativeElement;

      expect(element.getAttribute('role')).toEqual('region');
      expect(element.getAttribute('aria-live')).toEqual('assertive');
      expect(element.getAttribute('aria-relevant')).toEqual('all');
      expect(element.getAttribute('tabindex')).toEqual('-1');
    });

    it('should be able to add a simple alert', async () => {
      const message = 'simple message';
      alertService.add(message, { svgIcon: 'replacementbus' });

      fixture.detectChanges();
      await fixture.whenStable();

      const alerts = fixture.debugElement.queryAll(By.directive(SbbAlert));
      expect(alerts.length).toEqual(1);
      const icon = alerts[0].query(By.css('.sbb-alert-icon sbb-icon'));
      expect(icon.componentInstance.svgIcon).toEqual('replacementbus');
      const content = alerts[0].query(By.css('.sbb-alert-content'));
      const contentElement: HTMLElement = content.nativeElement;
      expect(contentElement.textContent).toEqual(message);
    });

    it('should be able to add a router link alert', async () => {
      const message = 'router link message';
      alertService.add(message, {
        routerLink: {
          routerLink: ['/test'],
          queryParams: { test: 10 },
          fragment: 'frag',
        },
      });

      fixture.detectChanges();
      await fixture.whenStable();

      const alert = fixture.debugElement.query(By.directive(SbbAlert));
      expect(alert.name).toEqual('a');
      const element: HTMLElement = alert.nativeElement;
      expect(element.attributes.getNamedItem('href')?.value).toEqual('/test?test=10#frag');
      const content = alert.query(By.css('.sbb-alert-content'));
      const contentElement: HTMLElement = content.nativeElement;
      expect(contentElement.textContent).toEqual(message);
    });

    it('should be able to add an external link alert', async () => {
      const link = 'https://sbb.ch';
      const message = 'external link message';
      alertService.add(message, { link });

      fixture.detectChanges();
      await fixture.whenStable();

      const alert = fixture.debugElement.query(By.directive(SbbAlert));
      expect(alert.name).toEqual('a');
      const element: HTMLElement = alert.nativeElement;
      expect(element.attributes.getNamedItem('href')?.value).toEqual(link);
      const content = alert.query(By.css('.sbb-alert-content'));
      const contentElement: HTMLElement = content.nativeElement;
      expect(contentElement.textContent).toEqual(message);
    });

    it('should be able to dismiss a alert via SbbAlertRef', async () => {
      const ref = alertService.add('example');

      fixture.detectChanges();
      await fixture.whenStable();

      let alerts = fixture.debugElement.queryAll(By.directive(SbbAlert));
      expect(alerts.length).toEqual(1);

      ref.dismiss();

      fixture.detectChanges();
      await fixture.whenStable();

      alerts = fixture.debugElement.queryAll(By.directive(SbbAlert));
      expect(alerts.length).toEqual(0);
    });

    it('should be able to clear all alerts via SbbAlertService', async () => {
      alertService.add('message 1');
      alertService.add('message 2');

      fixture.detectChanges();
      await fixture.whenStable();

      let alerts = fixture.debugElement.queryAll(By.directive(SbbAlert));
      expect(alerts.length).toEqual(2);

      alertService.dismissAll();

      fixture.detectChanges();
      await fixture.whenStable();

      alerts = fixture.debugElement.queryAll(By.directive(SbbAlert));
      expect(alerts.length).toEqual(0);
    });
  });

  describe('with internal alert', () => {
    let fixture: ComponentFixture<AlertOutletWithInnerAlert>;
    let alertService: SbbAlertService;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AlertOutletWithInnerAlert, NoopAnimationsModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AlertOutletWithInnerAlert);
      alertService = TestBed.inject(SbbAlertService);

      fixture.detectChanges();
    });

    it('should project the intial alert', () => {
      const nestedAlert = fixture.debugElement.query(By.directive(SbbAlert));
      expect(nestedAlert.componentInstance).toBeTruthy();
    });

    it('should add a new alert next to the existing one', async () => {
      const ref = alertService.add('example');

      fixture.detectChanges();
      await fixture.whenStable();

      let alerts = fixture.debugElement.queryAll(By.directive(SbbAlert));
      expect(alerts.length).toEqual(2);

      ref.dismiss();

      fixture.detectChanges();
      await fixture.whenStable();

      alerts = fixture.debugElement.queryAll(By.directive(SbbAlert));
      expect(alerts.length).toEqual(1);
    });
  });

  describe('with two outlets', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbAlertModule, AlertOutletError, NoopAnimationsModule],
      }).compileComponents();
    }));

    it('should throw', () => {
      expect(() => TestBed.createComponent(AlertOutletError)).toThrow();
    });
  });

  describe('with no outlets', () => {
    let fixture: ComponentFixture<AlertOutletWithInnerAlert>;
    let alertService: SbbAlertService;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbAlertModule, AlertOutletWithoutOutlet, NoopAnimationsModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AlertOutletWithoutOutlet);
      alertService = TestBed.inject(SbbAlertService);

      fixture.detectChanges();
    });

    it('should throw', () => {
      expect(() => alertService.add('Test')).toThrow();
    });
  });
});

@Component({
  selector: 'sbb-alert-simple',
  template: `<sbb-alert [svgIcon]="icon" (dismissed)="dismissed()">TEST</sbb-alert>`,
  standalone: true,
  imports: [RouterTestingModule, SbbIconTestingModule, SbbAlertModule],
})
export class AlertSimple {
  icon: string;
  dismissed() {}
}

@Component({
  selector: 'sbb-alert-router-link',
  template: `<a
    sbbAlert
    routerLink="/test"
    [queryParams]="{ param1: 'val1' }"
    fragment="frag1"
    (dismissed)="dismissed()"
    >router link</a
  >`,
  standalone: true,
  imports: [RouterTestingModule, SbbIconTestingModule, SbbAlertModule],
})
export class AlertRouterLink {
  dismissed() {}
}

@Component({
  selector: 'sbb-alert-external-link',
  template: `<a sbbAlert href="https://sbb.ch" (dismissed)="dismissed()">router link</a>`,
  standalone: true,
  imports: [RouterTestingModule, SbbIconTestingModule, SbbAlertModule],
})
export class AlertExternalLink {
  dismissed() {}
}

@Component({
  selector: 'sbb-alert-outlet-simple',
  template: `<sbb-alert-outlet></sbb-alert-outlet>`,
  standalone: true,
  imports: [RouterTestingModule, SbbIconTestingModule, SbbAlertModule],
})
export class AlertOutletSimple {
  constructor(public alertService: SbbAlertService) {}
}

@Component({
  selector: 'sbb-alert-outlet-with-inner-alert',
  template: `
    <sbb-alert-outlet>
      <sbb-alert>This is an initial alert inside an outlet.</sbb-alert>
    </sbb-alert-outlet>
  `,
  standalone: true,
  imports: [RouterTestingModule, SbbIconTestingModule, SbbAlertModule],
})
export class AlertOutletWithInnerAlert {}

@Component({
  selector: 'sbb-alert-outlet-error',
  template: `
    <sbb-alert-outlet></sbb-alert-outlet>
    <sbb-alert-outlet></sbb-alert-outlet>
  `,
  standalone: true,
  imports: [RouterTestingModule, SbbIconTestingModule, SbbAlertModule],
})
export class AlertOutletError {}

@Component({
  selector: 'sbb-alert-outlet-without-outlet',
  template: ``,
  standalone: true,
  imports: [RouterTestingModule, SbbIconTestingModule, SbbAlertModule],
})
export class AlertOutletWithoutOutlet {
  constructor(public alertService: SbbAlertService) {}
}

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbGhettobox, SbbGhettoboxModule, SbbGhettoboxOutlet, SbbGhettoboxService } from './index';

describe('SbbGhettobox', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          NoopAnimationsModule,
          SbbIconTestingModule,
          SbbGhettoboxModule,
        ],
        declarations: [GhettoboxSimple, GhettoboxRouterLink, GhettoboxExternalLink],
      }).compileComponents();
    })
  );

  describe('normal variant', () => {
    let fixture: ComponentFixture<GhettoboxSimple>;
    let component: GhettoboxSimple;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(GhettoboxSimple);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement.query(By.css('sbb-ghettobox'));

      fixture.detectChanges();
    });

    it('should bind proper accessibility attributes', () => {
      expect(debugElement.nativeElement.getAttribute('role')).toEqual('alert');
      expect(debugElement.nativeElement.getAttribute('tabindex')).toEqual('0');
    });

    it('should have the info default icon', () => {
      const icon = debugElement.query(By.css('.sbb-ghettobox-icon sbb-icon'));
      expect(icon.componentInstance.svgIcon).toEqual('fpl:info');
    });

    it('should display the given icon', () => {
      component.icon = 'fpl:disruption';
      fixture.detectChanges();
      const icon = debugElement.query(By.css('.sbb-ghettobox-icon sbb-icon'));
      expect(icon.componentInstance.svgIcon).toEqual('fpl:disruption');
    });

    it('should have "TEST" as message', () => {
      const ghettoboxMessage = debugElement.query(By.css('.sbb-ghettobox-content')).nativeElement
        .innerText;
      expect(ghettoboxMessage).toBe('TEST');
    });

    it('should delete the ghettobox on close button click', async () => {
      const closeButton = debugElement.query(By.css('.sbb-ghettobox-close-button'));

      spyOn(component, 'dismissed');

      closeButton.nativeElement.click();

      fixture.detectChanges();
      await fixture.whenStable();

      const ghettobox: SbbGhettobox = debugElement.componentInstance;
      expect(ghettobox._closed).toBe(true);
      expect(component.dismissed).toHaveBeenCalled();
    });
  });

  describe('router link variant', () => {
    let fixture: ComponentFixture<GhettoboxRouterLink>;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(GhettoboxRouterLink);
      debugElement = fixture.debugElement.query(By.css('a.sbb-ghettobox'));

      fixture.detectChanges();
    });

    it('should have the correct href', () => {
      const linkHref = debugElement.nativeElement.getAttribute('href');
      expect(linkHref).toBe('/test?param1=val1#frag1');
    });
  });

  describe('external link variant', () => {
    let fixture: ComponentFixture<GhettoboxExternalLink>;
    let debugElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(GhettoboxExternalLink);
      debugElement = fixture.debugElement.query(By.css('a.sbb-ghettobox'));

      fixture.detectChanges();
    });

    it('should have the correct href', () => {
      const linkHref = debugElement.nativeElement.getAttribute('href');
      expect(linkHref).toBe('https://sbb.ch');
    });
  });
});

describe('SbbGhettoboxOutlet', () => {
  describe('', () => {
    let fixture: ComponentFixture<GhettoboxOutletSimple>;
    let ghettoboxService: SbbGhettoboxService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            RouterTestingModule,
            NoopAnimationsModule,
            SbbIconTestingModule,
            SbbGhettoboxModule,
          ],
          declarations: [GhettoboxOutletSimple],
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(GhettoboxOutletSimple);
      ghettoboxService = fixture.componentInstance.ghettoboxService;

      fixture.detectChanges();
    });

    it('should bind proper accessibility attributes', () => {
      const element = fixture.debugElement.query(By.directive(SbbGhettoboxOutlet)).nativeElement;

      expect(element.getAttribute('role')).toEqual('region');
      expect(element.getAttribute('aria-live')).toEqual('assertive');
      expect(element.getAttribute('aria-relevant')).toEqual('all');
      expect(element.getAttribute('tabindex')).toEqual('-1');
    });

    it('should be able to add a simple ghettobox', async () => {
      const message = 'simple message';
      ghettoboxService.add(message, { icon: 'fpl:replacementbus' });

      fixture.detectChanges();
      await fixture.whenStable();

      const ghettoboxes = fixture.debugElement.queryAll(By.directive(SbbGhettobox));
      expect(ghettoboxes.length).toEqual(1);
      const icon = ghettoboxes[0].query(By.css('.sbb-ghettobox-icon sbb-icon'));
      expect(icon.componentInstance.svgIcon).toEqual('fpl:replacementbus');
      const content = ghettoboxes[0].query(By.css('.sbb-ghettobox-content'));
      const contentElement: HTMLElement = content.nativeElement;
      expect(contentElement.textContent).toEqual(message);
    });

    it('should be able to add a router link ghettobox', async () => {
      const message = 'router link message';
      ghettoboxService.add(message, {
        routerLink: {
          routerLink: ['/test'],
          queryParams: { test: 10 },
          fragment: 'frag',
        },
      });

      fixture.detectChanges();
      await fixture.whenStable();

      const ghettobox = fixture.debugElement.query(By.directive(SbbGhettobox));
      expect(ghettobox.name).toEqual('a');
      const element: HTMLElement = ghettobox.nativeElement;
      expect(element.attributes.getNamedItem('href')?.value).toEqual('/test?test=10#frag');
      const content = ghettobox.query(By.css('.sbb-ghettobox-content'));
      const contentElement: HTMLElement = content.nativeElement;
      expect(contentElement.textContent).toEqual(message);
    });

    it('should be able to add an external link ghettobox', async () => {
      const link = 'https://sbb.ch';
      const message = 'external link message';
      ghettoboxService.add(message, { link });

      fixture.detectChanges();
      await fixture.whenStable();

      const ghettobox = fixture.debugElement.query(By.directive(SbbGhettobox));
      expect(ghettobox.name).toEqual('a');
      const element: HTMLElement = ghettobox.nativeElement;
      expect(element.attributes.getNamedItem('href')?.value).toEqual(link);
      const content = ghettobox.query(By.css('.sbb-ghettobox-content'));
      const contentElement: HTMLElement = content.nativeElement;
      expect(contentElement.textContent).toEqual(message);
    });

    it('should be able to dismiss a ghettobox via SbbGhettoboxRef', async () => {
      const ref = ghettoboxService.add('example');

      fixture.detectChanges();
      await fixture.whenStable();

      let ghettoboxes = fixture.debugElement.queryAll(By.directive(SbbGhettobox));
      expect(ghettoboxes.length).toEqual(1);

      ref.dismiss();

      fixture.detectChanges();
      await fixture.whenStable();

      ghettoboxes = fixture.debugElement.queryAll(By.directive(SbbGhettobox));
      expect(ghettoboxes.length).toEqual(0);
    });

    it('should be able to clear all ghettoboxes via SbbGhettoboxService', async () => {
      ghettoboxService.add('message 1');
      ghettoboxService.add('message 2');

      fixture.detectChanges();
      await fixture.whenStable();

      let ghettoboxes = fixture.debugElement.queryAll(By.directive(SbbGhettobox));
      expect(ghettoboxes.length).toEqual(2);

      ghettoboxService.dismissAll();

      fixture.detectChanges();
      await fixture.whenStable();

      ghettoboxes = fixture.debugElement.queryAll(By.directive(SbbGhettobox));
      expect(ghettoboxes.length).toEqual(0);
    });
  });

  describe('with internal ghettobox', () => {
    let fixture: ComponentFixture<GhettoboxOutletWithInnerGhettobox>;
    let ghettoboxService: SbbGhettoboxService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            RouterTestingModule,
            NoopAnimationsModule,
            SbbIconTestingModule,
            SbbGhettoboxModule,
          ],
          declarations: [GhettoboxOutletWithInnerGhettobox],
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(GhettoboxOutletWithInnerGhettobox);
      ghettoboxService = TestBed.inject(SbbGhettoboxService);

      fixture.detectChanges();
    });

    it('should project the intial ghettobox', () => {
      const nestedGhettobox = fixture.debugElement.query(By.directive(SbbGhettobox));
      expect(nestedGhettobox.componentInstance).toBeTruthy();
    });

    it('should add a new ghettobox next to the existing one', async () => {
      const ref = ghettoboxService.add('example');

      fixture.detectChanges();
      await fixture.whenStable();

      let ghettoboxes = fixture.debugElement.queryAll(By.directive(SbbGhettobox));
      expect(ghettoboxes.length).toEqual(2);

      ref.dismiss();

      fixture.detectChanges();
      await fixture.whenStable();

      ghettoboxes = fixture.debugElement.queryAll(By.directive(SbbGhettobox));
      expect(ghettoboxes.length).toEqual(1);
    });
  });
});

@Component({
  selector: 'sbb-ghettobox-simple',
  template: `<sbb-ghettobox [indicatorIcon]="icon" (dismissed)="dismissed()">TEST</sbb-ghettobox>`,
})
export class GhettoboxSimple {
  icon: string;
  dismissed() {}
}

@Component({
  selector: 'sbb-ghettobox-router-link',
  template: `<a
    sbbGhettobox
    routerLink="/test"
    [queryParams]="{ param1: 'val1' }"
    fragment="frag1"
    (dismissed)="dismissed()"
    >router link</a
  >`,
})
export class GhettoboxRouterLink {
  dismissed() {}
}

@Component({
  selector: 'sbb-ghettobox-external-link',
  template: `<a sbbGhettobox href="https://sbb.ch" (dismissed)="dismissed()">router link</a>`,
})
export class GhettoboxExternalLink {
  dismissed() {}
}

@Component({
  selector: 'sbb-ghettobox-outlet-simple',
  template: `<sbb-ghettobox-outlet></sbb-ghettobox-outlet>`,
})
export class GhettoboxOutletSimple {
  constructor(public ghettoboxService: SbbGhettoboxService) {}
}

@Component({
  selector: 'sbb-ghettobox-outlet-with-inner-ghettobox',
  template: `
    <sbb-ghettobox-outlet>
      <sbb-ghettobox>This is an initial ghettobox inside an outlet.</sbb-ghettobox>
    </sbb-ghettobox-outlet>
  `,
})
export class GhettoboxOutletWithInnerGhettobox {}

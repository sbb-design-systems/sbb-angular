import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { dispatchMouseEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbBreadcrumbModule } from './breadcrumb.module';
import { SbbBreadcrumbs } from './breadcrumbs';

@Component({
  template: `
    <sbb-breadcrumbs>
      <a
        sbb-breadcrumb-root
        routerLink="/"
        routerLinkActive="sbb-active"
        aria-label="Back to the homepage"
      ></a>
      <sbb-breadcrumb>
        <a routerLink="/level1" routerLinkActive="sbb-active">Level 1</a>
      </sbb-breadcrumb>
      <sbb-breadcrumb>
        <a routerLink="/level1/level2" routerLinkActive="sbb-active" aria-current="location"
          >Level 2</a
        >
      </sbb-breadcrumb>
    </sbb-breadcrumbs>
  `,
  standalone: true,
  imports: [SbbBreadcrumbModule, RouterTestingModule, SbbMenuModule],
})
export class BreadcrumbsSimpleTest {}

@Component({
  template: `
    <sbb-breadcrumbs>
      <a
        sbb-breadcrumb-root
        routerLink="/"
        routerLinkActive="sbb-active"
        aria-label="Back to the homepage"
      ></a>

      <sbb-breadcrumb>
        <button [sbbMenuTriggerFor]="menu">Level 1 with sister pages</button>
        <sbb-menu #menu="sbbMenu">
          <a sbb-menu-item routerLink="/level1" routerLinkActive="sbb-active"
            >Level 1 with sister pages</a
          >
          <a sbb-menu-item routerLink="/level1b" routerLinkActive="sbb-active"
            >Level 1b with very long text that is wider than trigger</a
          >
        </sbb-menu>
      </sbb-breadcrumb>

      <sbb-breadcrumb>
        <a routerLink="/level1/level2b/level3" routerLinkActive="sbb-active" aria-current="location"
          >Level 3</a
        >
      </sbb-breadcrumb>
    </sbb-breadcrumbs>
  `,
  standalone: true,
  imports: [SbbBreadcrumbModule, SbbMenuModule],
})
export class BreadcrumbsMenuTest {}

describe('SbbBreadcrumbs', () => {
  describe('Instantiating', () => {
    let component: SbbBreadcrumbs;
    let fixture: ComponentFixture<SbbBreadcrumbs>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbIconTestingModule, NoopAnimationsModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SbbBreadcrumbs);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Breadcrumbs standalone', () => {
    let fixture: ComponentFixture<BreadcrumbsSimpleTest>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [BreadcrumbsSimpleTest, SbbIconTestingModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(BreadcrumbsSimpleTest);
      fixture.detectChanges();
    });

    it('should layout sbb-breadcrumb entries', () => {
      const breadcrumbs = fixture.debugElement.queryAll(By.css('.sbb-breadcrumb'));
      expect(breadcrumbs.length).toBe(4);

      const breadrcrumbRoot = fixture.debugElement.query(By.css('.sbb-breadcrumb-root'));
      expect(breadrcrumbRoot).toBeTruthy();
      expect(breadrcrumbRoot.query(By.css('.sbb-icon[svgicon="house-small"]'))).toBeTruthy();
      expect(breadrcrumbRoot)
        .withContext('Expected breadcrumbRoot to be at position 1')
        .toBe(breadcrumbs[0]);

      const breadcrumbDots = fixture.debugElement.query(By.css('.sbb-breadcrumb-dots'));
      expect(breadcrumbDots)
        .withContext('Expected breadcrumb dots to be at position 2')
        .toBe(breadcrumbs[1]);
    });

    it('should provide accessibility', () => {
      const breadcrumbList = fixture.debugElement.queryAll(By.css('.sbb-breadcrumb'));
      const breadcrumbWrapper = fixture.debugElement.query(By.css('.sbb-breadcrumbs-wrapper'));
      const breadcrumbs = fixture.debugElement.query(By.css('.sbb-breadcrumbs'));
      const breadcrumbDots = fixture.debugElement.query(By.css('.sbb-breadcrumb-dots'));

      expect(breadcrumbs.attributes['role']).toBe('navigation');
      expect(breadcrumbs.attributes['aria-label']).toBe('breadcrumbs');
      expect(breadcrumbWrapper.attributes['role']).toBe('list');
      breadcrumbList.forEach((breadcrumb) =>
        expect(breadcrumb.attributes['role']).toBe('listitem'),
      );

      expect(breadcrumbDots.nativeElement.querySelector('button')!.getAttribute('aria-label')).toBe(
        'Show entire path',
      );
    });

    it('should set sbb-breadcrumbs-expanded class when expanding', () => {
      const breadcrumbs = fixture.debugElement.query(By.directive(SbbBreadcrumbs));

      expect(breadcrumbs.nativeElement.classList).not.toContain('sbb-breadcrumbs-expanded');

      breadcrumbs.componentInstance.expand();
      fixture.detectChanges();

      expect(breadcrumbs.nativeElement.classList).toContain('sbb-breadcrumbs-expanded');
    });
  });

  describe('Breadcrumbs with menu', () => {
    let fixture: ComponentFixture<BreadcrumbsMenuTest>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbIconTestingModule, NoopAnimationsModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(BreadcrumbsMenuTest);
      fixture.detectChanges();
    });

    it('should place panel trigger text at same position as trigger text', () => {
      const menuTrigger = fixture.debugElement.query(
        By.css('.sbb-menu-trigger-breadcrumb'),
      ).nativeElement;
      dispatchMouseEvent(menuTrigger, 'click');
      fixture.detectChanges();
      const menuTriggerPanel = fixture.debugElement.query(
        By.css('.sbb-menu-panel-trigger'),
      ).nativeElement;

      // Trigger text has to be at the exact same position on the screen
      const menuTriggerText = document.createRange();
      menuTriggerText.selectNode(menuTrigger.childNodes[0]);

      const menuTriggerPanelText = document.createRange();
      menuTriggerPanelText.selectNode(menuTriggerPanel.childNodes[0]);

      expect(menuTriggerText.getBoundingClientRect().left).toBe(
        menuTriggerPanelText.getBoundingClientRect().left,
      );
      expect(menuTriggerText.getBoundingClientRect().top).toBe(
        menuTriggerPanelText.getBoundingClientRect().top,
      );
    });

    it('should grow panel to the right side and stretch trigger width too', () => {
      const menuTrigger = fixture.debugElement.query(
        By.css('.sbb-menu-trigger-breadcrumb'),
      ).nativeElement;
      dispatchMouseEvent(menuTrigger, 'click');
      fixture.detectChanges();
      const menuTriggerPanel = fixture.debugElement.query(
        By.css('.sbb-menu-panel-trigger'),
      ).nativeElement;
      const menuPanel = fixture.debugElement.query(By.css('.sbb-menu-panel')).nativeElement;

      const xOffset = 30;
      expect(menuTrigger.getBoundingClientRect().left)
        .withContext('Expected menu trigger to be left aligned with trigger including x offset')
        .toBe(menuTriggerPanel.getBoundingClientRect().left + xOffset);
      expect(parseInt(getComputedStyle(menuTrigger).width, 10) + 2 * xOffset)
        .withContext('Expected panel trigger width to be wider than trigger')
        .toBeLessThan(parseInt(getComputedStyle(menuTriggerPanel).width, 10));

      // Panel trigger should be as wide as panel and aligned with panel
      expect(menuTriggerPanel.getBoundingClientRect().right).toBe(
        menuPanel.getBoundingClientRect().right,
      );
      expect(menuTriggerPanel.getBoundingClientRect().left).toBe(
        menuPanel.getBoundingClientRect().left,
      );
    });
  });
});

import { Direction, Directionality } from '@angular/cdk/bidi';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { dispatchFakeEvent, dispatchKeyboardEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { Subject } from 'rxjs';

import { SbbTabLink, SbbTabNav, SbbTabsModule } from './index';

describe('SbbTabNavBar', () => {
  const dir: Direction = 'ltr';
  const dirChange = new Subject<void>();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbTabsModule, SbbIconTestingModule],
      declarations: [
        SimpleTabNavBarTestApp,
        TabLinkWithNgIf,
        TabLinkWithTabIndexBinding,
        TabLinkWithNativeTabindexAttr,
        TabBarWithInactiveTabsOnInit,
        TabBarWithPanel,
      ],
      providers: [
        { provide: Directionality, useFactory: () => ({ value: dir, change: dirChange }) },
      ],
    });

    TestBed.compileComponents();
  }));

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleTabNavBarTestApp>;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
      fixture.detectChanges();
    });

    it('should change active index on click', () => {
      // select the second link
      let tabLink = fixture.debugElement.queryAll(By.css('a'))[1];
      tabLink.nativeElement.click();
      expect(fixture.componentInstance.activeIndex).toBe(1);

      // select the third link
      tabLink = fixture.debugElement.queryAll(By.css('a'))[2];
      tabLink.nativeElement.click();
      expect(fixture.componentInstance.activeIndex).toBe(2);
    });

    it('should add the active class if active', () => {
      const tabLink1 = fixture.debugElement.queryAll(By.css('a'))[0];
      const tabLink2 = fixture.debugElement.queryAll(By.css('a'))[1];
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      tabLink1.nativeElement.click();
      fixture.detectChanges();
      expect(tabLinkElements[0].classList.contains('sbb-tab-label-active')).toBeTruthy();
      expect(tabLinkElements[1].classList.contains('sbb-tab-label-active')).toBeFalsy();

      tabLink2.nativeElement.click();
      fixture.detectChanges();
      expect(tabLinkElements[0].classList.contains('sbb-tab-label-active')).toBeFalsy();
      expect(tabLinkElements[1].classList.contains('sbb-tab-label-active')).toBeTruthy();
    });

    it('should toggle aria-current based on active state', () => {
      const tabLink1 = fixture.debugElement.queryAll(By.css('a'))[0];
      const tabLink2 = fixture.debugElement.queryAll(By.css('a'))[1];
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      tabLink1.nativeElement.click();
      fixture.detectChanges();
      expect(tabLinkElements[0].getAttribute('aria-current')).toEqual('page');
      expect(tabLinkElements[1].hasAttribute('aria-current')).toEqual(false);

      tabLink2.nativeElement.click();
      fixture.detectChanges();
      expect(tabLinkElements[0].hasAttribute('aria-current')).toEqual(false);
      expect(tabLinkElements[1].getAttribute('aria-current')).toEqual('page');
    });

    it('should add the disabled class if disabled', () => {
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      expect(
        tabLinkElements.every((tabLinkEl) => !tabLinkEl.classList.contains('sbb-tab-disabled')),
      )
        .withContext('Expected every tab link to not have the disabled class initially')
        .toBe(true);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(tabLinkElements.every((tabLinkEl) => tabLinkEl.classList.contains('sbb-tab-disabled')))
        .withContext('Expected every tab link to have the disabled class if set through binding')
        .toBe(true);
    });

    it('should update aria-disabled if disabled', () => {
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      expect(tabLinkElements.every((tabLink) => tabLink.getAttribute('aria-disabled') === 'false'))
        .withContext('Expected aria-disabled to be set to "false" by default.')
        .toBe(true);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(tabLinkElements.every((tabLink) => tabLink.getAttribute('aria-disabled') === 'true'))
        .withContext('Expected aria-disabled to be set to "true" if link is disabled.')
        .toBe(true);
    });

    it('should update the tabindex if links are disabled', () => {
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      expect(tabLinkElements.every((tabLink) => tabLink.tabIndex === 0))
        .withContext('Expected element to be keyboard focusable by default')
        .toBe(true);

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(tabLinkElements.every((tabLink) => tabLink.tabIndex === -1))
        .withContext('Expected element to no longer be keyboard focusable if disabled.')
        .toBe(true);
    });

    it('should mark disabled links', () => {
      const tabLinkElement = fixture.debugElement.query(By.css('a'))!.nativeElement;

      expect(tabLinkElement.classList).not.toContain('sbb-tab-disabled');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(tabLinkElement.classList).toContain('sbb-tab-disabled');
    });

    it('should update the focusIndex when a tab receives focus directly', () => {
      const thirdLink = fixture.debugElement.queryAll(By.css('a'))[2];
      dispatchFakeEvent(thirdLink.nativeElement, 'focus');
      fixture.detectChanges();

      expect(fixture.componentInstance.tabNavBar.focusIndex).toBe(2);
    });
  });

  it('should support the native tabindex attribute', () => {
    const fixture = TestBed.createComponent(TabLinkWithNativeTabindexAttr);
    fixture.detectChanges();

    const tabLink = fixture.debugElement
      .query(By.directive(SbbTabLink))!
      .injector.get<SbbTabLink>(SbbTabLink);

    expect(tabLink.tabIndex)
      .withContext('Expected the tabIndex to be set from the native tabindex attribute.')
      .toBe(5);
  });

  it('should support binding to the tabIndex', () => {
    const fixture = TestBed.createComponent(TabLinkWithTabIndexBinding);
    fixture.detectChanges();

    const tabLink = fixture.debugElement
      .query(By.directive(SbbTabLink))!
      .injector.get<SbbTabLink>(SbbTabLink);

    expect(tabLink.tabIndex)
      .withContext('Expected the tabIndex to be set to 0 by default.')
      .toBe(0);

    fixture.componentInstance.tabIndex = 3;
    fixture.detectChanges();

    expect(tabLink.tabIndex).withContext('Expected the tabIndex to be have been set to 3.').toBe(3);
  });

  it('should select the proper tab, if the tabs come in after init', () => {
    const fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
    const instance = fixture.componentInstance;

    instance.tabs = [];
    instance.activeIndex = 1;
    fixture.detectChanges();

    expect(instance.tabNavBar.selectedIndex).toBe(-1);

    instance.tabs = [0, 1, 2];
    fixture.detectChanges();

    expect(instance.tabNavBar.selectedIndex).toBe(1);
  });

  describe('without panel', () => {
    let fixture: ComponentFixture<SimpleTabNavBarTestApp>;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabNavBarTestApp);
      fixture.detectChanges();
    });

    it('should have no explicit roles', () => {
      const tabBar = fixture.nativeElement.querySelector('.sbb-tab-nav-bar')!;
      expect(tabBar.getAttribute('role')).toBe(null);

      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[0].getAttribute('role')).toBe(null);
      expect(tabLinks[1].getAttribute('role')).toBe(null);
      expect(tabLinks[2].getAttribute('role')).toBe(null);
    });

    it('should not setup aria-controls', () => {
      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[0].getAttribute('aria-controls')).toBe(null);
      expect(tabLinks[1].getAttribute('aria-controls')).toBe(null);
      expect(tabLinks[2].getAttribute('aria-controls')).toBe(null);
    });

    it('should not manage aria-selected', () => {
      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[0].getAttribute('aria-selected')).toBe(null);
      expect(tabLinks[1].getAttribute('aria-selected')).toBe(null);
      expect(tabLinks[2].getAttribute('aria-selected')).toBe(null);
    });

    it('should not activate a link when space is pressed', () => {
      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[1].classList.contains('sbb-tab-label-active')).toBe(false);

      dispatchKeyboardEvent(tabLinks[1], 'keydown', SPACE);
      fixture.detectChanges();

      expect(tabLinks[1].classList.contains('sbb-tab-label-active')).toBe(false);
    });
  });

  describe('with panel', () => {
    let fixture: ComponentFixture<TabBarWithPanel>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TabBarWithPanel);
      fixture.detectChanges();
    });

    it('should have the proper roles', () => {
      const tabBar = fixture.nativeElement.querySelector('.sbb-tab-nav-bar')!;
      expect(tabBar.getAttribute('role')).toBe('tablist');

      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[0].getAttribute('role')).toBe('tab');
      expect(tabLinks[1].getAttribute('role')).toBe('tab');
      expect(tabLinks[2].getAttribute('role')).toBe('tab');

      const tabPanel = fixture.nativeElement.querySelector('.sbb-tab-nav-panel')!;
      expect(tabPanel.getAttribute('role')).toBe('tabpanel');
    });

    it('should manage tabindex properly', () => {
      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[0].tabIndex).toBe(0);
      expect(tabLinks[1].tabIndex).toBe(-1);
      expect(tabLinks[2].tabIndex).toBe(-1);

      tabLinks[1].click();
      fixture.detectChanges();

      expect(tabLinks[0].tabIndex).toBe(-1);
      expect(tabLinks[1].tabIndex).toBe(0);
      expect(tabLinks[2].tabIndex).toBe(-1);
    });

    it('should setup aria-controls properly', () => {
      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[0].getAttribute('aria-controls')).toBe('tab-panel');
      expect(tabLinks[1].getAttribute('aria-controls')).toBe('tab-panel');
      expect(tabLinks[2].getAttribute('aria-controls')).toBe('tab-panel');
    });

    it('should not manage aria-current', () => {
      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[0].getAttribute('aria-current')).toBe(null);
      expect(tabLinks[1].getAttribute('aria-current')).toBe(null);
      expect(tabLinks[2].getAttribute('aria-current')).toBe(null);
    });

    it('should manage aria-selected properly', () => {
      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[0].getAttribute('aria-selected')).toBe('true');
      expect(tabLinks[1].getAttribute('aria-selected')).toBe('false');
      expect(tabLinks[2].getAttribute('aria-selected')).toBe('false');

      tabLinks[1].click();
      fixture.detectChanges();

      expect(tabLinks[0].getAttribute('aria-selected')).toBe('false');
      expect(tabLinks[1].getAttribute('aria-selected')).toBe('true');
      expect(tabLinks[2].getAttribute('aria-selected')).toBe('false');
    });

    it('should activate a link when space is pressed', () => {
      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[1].classList.contains('sbb-tab-label-active')).toBe(false);

      dispatchKeyboardEvent(tabLinks[1], 'keydown', SPACE);
      fixture.detectChanges();

      expect(tabLinks[1].classList.contains('sbb-tab-label-active')).toBe(true);
    });

    it('should activate a link when enter is pressed', () => {
      fixture.detectChanges();

      const tabLinks = fixture.nativeElement.querySelectorAll('.sbb-tab-link');
      expect(tabLinks[1].classList.contains('sbb-tab-label-active')).toBe(false);

      dispatchKeyboardEvent(tabLinks[1], 'keydown', ENTER);
      fixture.detectChanges();

      expect(tabLinks[1].classList.contains('sbb-tab-label-active')).toBe(true);
    });
  });
});

@Component({
  selector: 'test-app',
  template: `
    <nav sbb-tab-nav-bar>
      <a
        sbb-tab-link
        *ngFor="let tab of tabs; let index = index"
        [active]="activeIndex === index"
        [disabled]="disabled"
        (click)="activeIndex = index"
      >
        Tab link {{ label }}
      </a>
    </nav>
  `,
})
class SimpleTabNavBarTestApp {
  @ViewChild(SbbTabNav) tabNavBar: SbbTabNav;
  @ViewChildren(SbbTabLink) tabLinks: QueryList<SbbTabLink>;

  label = '';
  disabled = false;
  tabs = [0, 1, 2];

  activeIndex = 0;
}

@Component({
  template: `
    <nav sbb-tab-nav-bar>
      <a sbb-tab-link *ngIf="!isDestroyed">Link</a>
    </nav>
  `,
})
class TabLinkWithNgIf {
  isDestroyed = false;
}

@Component({
  template: `
    <nav sbb-tab-nav-bar>
      <a sbb-tab-link [tabIndex]="tabIndex">TabIndex Link</a>
    </nav>
  `,
})
class TabLinkWithTabIndexBinding {
  tabIndex = 0;
}

@Component({
  template: `
    <nav sbb-tab-nav-bar>
      <a sbb-tab-link tabindex="5">Link</a>
    </nav>
  `,
})
class TabLinkWithNativeTabindexAttr {}

@Component({
  template: `
    <nav sbb-tab-nav-bar>
      <a sbb-tab-link *ngFor="let tab of tabs" [active]="false">Tab link {{ label }}</a>
    </nav>
  `,
})
class TabBarWithInactiveTabsOnInit {
  tabs = [0, 1, 2];
}

@Component({
  template: `
    <nav sbb-tab-nav-bar [tabPanel]="tabPanel">
      <a
        sbb-tab-link
        *ngFor="let tab of tabs; let index = index"
        [active]="index === activeIndex"
        (click)="activeIndex = index"
      >
        Tab link
      </a>
    </nav>
    <sbb-tab-nav-panel #tabPanel id="tab-panel">Tab panel</sbb-tab-nav-panel>
  `,
})
class TabBarWithPanel {
  tabs = [0, 1, 2];
  activeIndex = 0;
}

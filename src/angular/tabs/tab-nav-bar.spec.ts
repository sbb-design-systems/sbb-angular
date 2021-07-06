import { Direction, Directionality } from '@angular/cdk/bidi';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { SbbTabLink, SbbTabNav, SbbTabsModule } from './index';

describe('SbbTabNavBar', () => {
  const dir: Direction = 'ltr';
  const dirChange = new Subject();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbTabsModule],
        declarations: [
          SimpleTabNavBarTestApp,
          TabLinkWithNgIf,
          TabLinkWithTabIndexBinding,
          TabLinkWithNativeTabindexAttr,
          TabBarWithInactiveTabsOnInit,
        ],
        providers: [
          { provide: Directionality, useFactory: () => ({ value: dir, change: dirChange }) },
        ],
      });

      TestBed.compileComponents();
    })
  );

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
        tabLinkElements.every((tabLinkEl) => !tabLinkEl.classList.contains('sbb-tab-disabled'))
      ).toBe(true, 'Expected every tab link to not have the disabled class initially');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(
        tabLinkElements.every((tabLinkEl) => tabLinkEl.classList.contains('sbb-tab-disabled'))
      ).toBe(true, 'Expected every tab link to have the disabled class if set through binding');
    });

    it('should update aria-disabled if disabled', () => {
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      expect(
        tabLinkElements.every((tabLink) => tabLink.getAttribute('aria-disabled') === 'false')
      ).toBe(true, 'Expected aria-disabled to be set to "false" by default.');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(
        tabLinkElements.every((tabLink) => tabLink.getAttribute('aria-disabled') === 'true')
      ).toBe(true, 'Expected aria-disabled to be set to "true" if link is disabled.');
    });

    it('should update the tabindex if links are disabled', () => {
      const tabLinkElements = fixture.debugElement
        .queryAll(By.css('a'))
        .map((tabLinkDebugEl) => tabLinkDebugEl.nativeElement);

      expect(tabLinkElements.every((tabLink) => tabLink.tabIndex === 0)).toBe(
        true,
        'Expected element to be keyboard focusable by default'
      );

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(tabLinkElements.every((tabLink) => tabLink.tabIndex === -1)).toBe(
        true,
        'Expected element to no longer be keyboard focusable if disabled.'
      );
    });

    it('should mark disabled links', () => {
      const tabLinkElement = fixture.debugElement.query(By.css('a'))!.nativeElement;

      expect(tabLinkElement.classList).not.toContain('sbb-tab-disabled');

      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(tabLinkElement.classList).toContain('sbb-tab-disabled');
    });
  });

  it('should support the native tabindex attribute', () => {
    const fixture = TestBed.createComponent(TabLinkWithNativeTabindexAttr);
    fixture.detectChanges();

    const tabLink = fixture.debugElement
      .query(By.directive(SbbTabLink))!
      .injector.get<SbbTabLink>(SbbTabLink);

    expect(tabLink.tabIndex).toBe(
      5,
      'Expected the tabIndex to be set from the native tabindex attribute.'
    );
  });

  it('should support binding to the tabIndex', () => {
    const fixture = TestBed.createComponent(TabLinkWithTabIndexBinding);
    fixture.detectChanges();

    const tabLink = fixture.debugElement
      .query(By.directive(SbbTabLink))!
      .injector.get<SbbTabLink>(SbbTabLink);

    expect(tabLink.tabIndex).toBe(0, 'Expected the tabIndex to be set to 0 by default.');

    fixture.componentInstance.tabIndex = 3;
    fixture.detectChanges();

    expect(tabLink.tabIndex).toBe(3, 'Expected the tabIndex to be have been set to 3.');
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

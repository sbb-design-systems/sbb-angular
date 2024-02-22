import { Direction } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import { MediaMatcher } from '@angular/cdk/layout';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { Breakpoints } from '@sbb-esta/angular/core';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchKeyboardEvent,
  FakeMediaMatcher,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbSidebarModule } from '../sidebar.module';

import { SbbSidebar, SbbSidebarContainer } from './sidebar';

let mediaMatcher: FakeMediaMatcher;

const PROVIDE_FAKE_MEDIA_MATCHER = {
  provide: MediaMatcher,
  useFactory: () => {
    mediaMatcher = new FakeMediaMatcher();
    mediaMatcher.defaultMatches = false; // enforce desktop view
    return mediaMatcher;
  },
};

const registerClearMediaMatcher = () => {
  afterEach(() => {
    mediaMatcher.clear();
  });
};

describe('SbbSidebar', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule],
      providers: [PROVIDE_FAKE_MEDIA_MATCHER],
    });

    TestBed.compileComponents();
  }));

  registerClearMediaMatcher();

  describe('methods', () => {
    it('should be able to open', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const container = fixture.debugElement.query(By.css('sbb-sidebar-container'))!.nativeElement;

      fixture.debugElement.query(By.css('.open'))!.nativeElement.click();
      fixture.detectChanges();

      expect(testComponent.openCount).toBe(0);
      expect(testComponent.openStartCount).toBe(0);
      expect(container.classList).not.toContain('sbb-sidebar-container-has-open');

      tick();
      expect(testComponent.openStartCount).toBe(1);
      fixture.detectChanges();

      expect(testComponent.openCount).toBe(1);
      expect(testComponent.openStartCount).toBe(1);
      expect(container.classList).toContain('sbb-sidebar-container-has-open');
    }));

    it('should be able to close', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const container = fixture.debugElement.query(By.css('sbb-sidebar-container'))!.nativeElement;

      fixture.debugElement.query(By.css('.open'))!.nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.close'))!.nativeElement.click();
      fixture.detectChanges();

      expect(testComponent.closeCount).toBe(0);
      expect(testComponent.closeStartCount).toBe(0);
      expect(container.classList).toContain('sbb-sidebar-container-has-open');

      flush();
      expect(testComponent.closeStartCount).toBe(1);
      fixture.detectChanges();

      expect(testComponent.closeCount).toBe(1);
      expect(testComponent.closeStartCount).toBe(1);
      expect(container.classList).not.toContain('sbb-sidebar-container-has-open');
    }));

    it('should resolve the open method promise with the new state of the sidebar', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const sidebar: SbbSidebar = fixture.debugElement.query(
        By.directive(SbbSidebar),
      )!.componentInstance;

      sidebar.open().then((result) => expect(result).toBe('open'));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should resolve the close method promise with the new state of the sidebar', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const sidebar = fixture.debugElement.query(By.directive(SbbSidebar))!;
      const sidebarInstance: SbbSidebar = sidebar.componentInstance;

      sidebarInstance.open();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      sidebarInstance.close().then((result) => expect(result).toBe('close'));
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
    }));

    it('should be able to close while the open animation is running', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      fixture.debugElement.query(By.css('.open'))!.nativeElement.click();
      fixture.detectChanges();

      expect(testComponent.openCount).toBe(0);
      expect(testComponent.closeCount).toBe(0);

      tick();
      fixture.debugElement.query(By.css('.close'))!.nativeElement.click();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      expect(testComponent.openCount).toBe(1);
      expect(testComponent.closeCount).toBe(1);
    }));

    it('does not throw when created without a sidebar', fakeAsync(() => {
      expect(() => {
        const fixture = TestBed.createComponent(BasicTestComponent);
        fixture.detectChanges();
        tick();
      }).not.toThrow();
    }));

    it('should emit the backdropClick event when the backdrop is clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const openButtonElement = fixture.debugElement.query(By.css('.open'))!.nativeElement;

      openButtonElement.click();
      fixture.detectChanges();
      flush();

      expect(testComponent.backdropClickedCount).toBe(0);

      fixture.debugElement.query(By.css('.sbb-sidebar-backdrop'))!.nativeElement.click();
      fixture.detectChanges();
      flush();

      expect(testComponent.backdropClickedCount).toBe(1);

      openButtonElement.click();
      fixture.detectChanges();
      flush();

      fixture.debugElement.query(By.css('.close'))!.nativeElement.click();
      fixture.detectChanges();
      flush();

      expect(testComponent.backdropClickedCount).toBe(1);
    }));

    it('should close when pressing escape in over mode', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const sidebar = fixture.debugElement.query(By.directive(SbbSidebar))!;

      sidebar.componentInstance.open();
      fixture.detectChanges();
      tick();

      expect(testComponent.openCount).withContext('Expected one open event.').toBe(1);
      expect(testComponent.openStartCount).withContext('Expected one open start event.').toBe(1);
      expect(testComponent.closeCount).withContext('Expected no close events.').toBe(0);
      expect(testComponent.closeStartCount).withContext('Expected no close start events.').toBe(0);

      const event = dispatchKeyboardEvent(sidebar.nativeElement, 'keydown', ESCAPE);
      fixture.detectChanges();
      flush();

      expect(testComponent.closeCount).withContext('Expected one close event.').toBe(1);
      expect(testComponent.closeStartCount).withContext('Expected one close start event.').toBe(1);
      expect(event.defaultPrevented).toBe(true);
    }));

    it('should not close when pressing escape in side mode', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const sidebar = fixture.debugElement.query(By.directive(SbbSidebar))!;

      dispatchKeyboardEvent(sidebar.nativeElement, 'keydown', ESCAPE);
      fixture.detectChanges();
      flush();

      expect(testComponent.closeCount).withContext('Expected no close events.').toBe(0);
      expect(testComponent.closeStartCount).withContext('Expected no close start events.').toBe(0);
    }));

    it('should not close when pressing escape with a modifier', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const sidebar = fixture.debugElement.query(By.directive(SbbSidebar))!;

      sidebar.componentInstance.open();
      fixture.detectChanges();
      tick();

      expect(testComponent.closeCount).withContext('Expected no close events.').toBe(0);
      expect(testComponent.closeStartCount).withContext('Expected no close start events.').toBe(0);

      const event = createKeyboardEvent('keydown', ESCAPE, undefined, { alt: true });
      dispatchEvent(sidebar.nativeElement, event);
      fixture.detectChanges();
      flush();

      expect(testComponent.closeCount).withContext('Expected still no close events.').toBe(0);
      expect(testComponent.closeStartCount)
        .withContext('Expected still no close start events.')
        .toBe(0);
      expect(event.defaultPrevented).toBe(false);
    }));

    it('should restore focus on close if backdrop has been clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const sidebar = fixture.debugElement.query(By.directive(SbbSidebar))!.componentInstance;
      const openButton = fixture.componentInstance.openButton.nativeElement;

      openButton.focus();
      sidebar.open();
      fixture.detectChanges();
      flush();

      const backdrop = fixture.nativeElement.querySelector('.sbb-sidebar-backdrop');
      expect(backdrop).toBeTruthy();

      // Ensure the element that has been focused on sidebar open is blurred. This simulates
      // the behavior where clicks on the backdrop blur the active element.
      if (document.activeElement !== null && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      backdrop.click();
      fixture.detectChanges();
      flush();

      expect(document.activeElement)
        .withContext('Expected focus to be restored to the open button on close.')
        .toBe(openButton);
    }));

    it('should restore focus on close if focus is on sidebar', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);

      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const sidebar = fixture.debugElement.query(By.directive(SbbSidebar))!.componentInstance;
      const openButton = fixture.componentInstance.openButton.nativeElement;
      const sidebarButton = fixture.componentInstance.sidebarButton.nativeElement;

      openButton.focus();
      sidebar.open();
      fixture.detectChanges();
      flush();
      sidebarButton.focus();

      sidebar.close();
      fixture.detectChanges();
      flush();

      expect(document.activeElement)
        .withContext('Expected focus to be restored to the open button on close.')
        .toBe(openButton);
    }));

    it('should restore focus to an SVG element', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const sidebar = fixture.debugElement.query(By.directive(SbbSidebar))!.componentInstance;
      const svg = fixture.componentInstance.svg.nativeElement;
      const sidebarButton = fixture.componentInstance.sidebarButton.nativeElement;

      svg.focus();
      sidebar.open();
      fixture.detectChanges();
      flush();
      sidebarButton.focus();

      sidebar.close();
      fixture.detectChanges();
      flush();

      expect(document.activeElement)
        .withContext('Expected focus to be restored to the SVG element on close.')
        .toBe(svg);
    }));

    it('should not restore focus on close if focus is outside sidebar', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const sidebar: SbbSidebar = fixture.debugElement.query(
        By.directive(SbbSidebar),
      )!.componentInstance;

      const openButton = fixture.componentInstance.openButton.nativeElement;
      const closeButton = fixture.componentInstance.closeButton.nativeElement;

      openButton.focus();
      sidebar.open();

      fixture.detectChanges();
      tick();
      closeButton.focus();

      sidebar.close();
      fixture.detectChanges();
      tick();

      expect(document.activeElement)
        .withContext('Expected focus not to be restored to the open button on close.')
        .toBe(closeButton);
    }));

    it('should pick up sidebars that are not direct descendants', fakeAsync(() => {
      const fixture = TestBed.createComponent(IndirectDescendantSidebarTestComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.sidebar.opened).toBe(true);

      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      expect(fixture.componentInstance.sidebar.opened).toBe(false);
    }));

    it('should not pick up sidebars from nested containers', fakeAsync(() => {
      const fixture = TestBed.createComponent(NestedSidebarContainersTestComponent);
      const instance = fixture.componentInstance;
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      expect(instance.outerSidebar.opened).toBe(false);
      expect(instance.innerSidebar.opened).toBe(false);

      instance.outerContainer.open();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(instance.outerSidebar.opened).toBe(true);
      expect(instance.innerSidebar.opened).toBe(false);

      instance.innerContainer.open();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(instance.outerSidebar.opened).toBe(true);
      expect(instance.innerSidebar.opened).toBe(true);
    }));
  });

  describe('attributes', () => {
    it('should remove align attr from DOM', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const sidebarEl = fixture.debugElement.query(By.css('sbb-sidebar'))!.nativeElement;
      expect(sidebarEl.hasAttribute('align'))
        .withContext('Expected sidebar not to have a native align attribute.')
        .toBe(false);
    });

    it('should throw when multiple sidebars are included', fakeAsync(() => {
      const fixture = TestBed.createComponent(TwoSidebarsTestComponent);

      expect(() => {
        try {
          fixture.detectChanges();
          tick(0);
        } catch {
          tick(0);
        }
      }).toThrow();
    }));

    it('should not throw when a two-way binding is toggled quickly while animating', fakeAsync(() => {
      TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [BrowserAnimationsModule, SbbIconTestingModule],
          providers: [PROVIDE_FAKE_MEDIA_MATCHER],
        })
        .compileComponents();

      const fixture = TestBed.createComponent(SidebarOpenBindingTestComponent);
      fixture.detectChanges();
      inject([MediaMatcher], (m: FakeMediaMatcher) => (mediaMatcher = m))();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      // Note that we need actual timeouts and the `BrowserAnimationsModule`
      // in order to test it correctly.
      setTimeout(() => {
        const sidebar: SbbSidebar = fixture.debugElement.query(
          By.directive(SbbSidebar),
        ).componentInstance;
        sidebar.toggle();
        expect(() => fixture.detectChanges()).not.toThrow();

        setTimeout(() => {
          sidebar.toggle();
          expect(() => fixture.detectChanges()).not.toThrow();
        }, 1);

        tick(1);
      }, 1);

      tick(1);
      flush();
    }));
  });

  describe('focus trapping behavior', () => {
    let fixture: ComponentFixture<SidebarWithFocusableElementsTestComponent>;
    let sidebar: SbbSidebar;
    let lastFocusableElement: HTMLElement;
    let mobileCloseSidebarButton: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SidebarWithFocusableElementsTestComponent);
      fixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();
      sidebar = fixture.debugElement.query(By.directive(SbbSidebar))!.componentInstance;
      lastFocusableElement = fixture.debugElement.query(By.css('.input2'))!.nativeElement;
      mobileCloseSidebarButton = fixture.debugElement.query(
        By.css('.sbb-sidebar-mobile-menu-bar-close'),
      )!.nativeElement;
      lastFocusableElement.focus();
    }));

    it('should trap focus when opened in "over" mode', fakeAsync(() => {
      fixture.detectChanges();
      lastFocusableElement.focus();

      sidebar.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(mobileCloseSidebarButton);
    }));

    it('should not auto-focus by default when opened in "side" mode', fakeAsync(() => {
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, false);
      tick();
      fixture.detectChanges();
      lastFocusableElement.focus();

      sidebar.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(lastFocusableElement);
    }));

    it('should focus the close button if there are no focusable elements', fakeAsync(() => {
      fixture.destroy();

      const nonFocusableFixture = TestBed.createComponent(
        SidebarWithoutFocusableElementsTestComponent,
      );
      nonFocusableFixture.detectChanges();
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      const sidebarEl = nonFocusableFixture.debugElement.query(By.directive(SbbSidebar))!;
      sidebarEl.nativeElement.focus();
      nonFocusableFixture.detectChanges();

      sidebarEl.componentInstance.open();
      nonFocusableFixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(
        nonFocusableFixture.debugElement.query(By.css('.sbb-sidebar-mobile-menu-bar-close'))!
          .nativeElement,
      );
    }));

    it('should update the focus trap enable state if the mode changes while open', fakeAsync(() => {
      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, false);
      tick();
      fixture.detectChanges();

      const anchors = Array.from<HTMLElement>(
        fixture.nativeElement.querySelectorAll('.cdk-focus-trap-anchor'),
      );

      expect(anchors.every((anchor) => !anchor.hasAttribute('tabindex')))
        .withContext('Expected focus trap anchors to be disabled in side mode.')
        .toBe(true);

      mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
      tick();

      sidebar.open();
      fixture.detectChanges();

      expect(anchors.every((anchor) => anchor.getAttribute('tabindex') === '0'))
        .withContext('Expected focus trap anchors to be enabled in over mode.')
        .toBe(true);
    }));
  });

  it('should mark the sidebar content as scrollable', () => {
    const fixture = TestBed.createComponent(BasicTestComponent);
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.sbb-sidebar-inner-container'));
    const scrollable = content.injector.get(CdkScrollable);
    expect(scrollable).toBeTruthy();
    expect(scrollable.getElementRef().nativeElement).toBe(content.nativeElement);
  });

  describe('DOM position', () => {
    it('should project start sidebar before the content', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const allNodes = getSidebarNodesArray(fixture);
      const sidebarIndex = allNodes.indexOf(fixture.nativeElement.querySelector('.sbb-sidebar'));
      const contentIndex = allNodes.indexOf(
        fixture.nativeElement.querySelector('.sbb-sidebar-content'),
      );

      expect(sidebarIndex)
        .withContext('Expected sidebar to be inside the container')
        .toBeGreaterThan(-1);
      expect(contentIndex)
        .withContext('Expected content to be inside the container')
        .toBeGreaterThan(-1);
      expect(sidebarIndex)
        .withContext('Expected sidebar to be before the content')
        .toBeLessThan(contentIndex);
    });

    function getSidebarNodesArray(fixture: ComponentFixture<any>): HTMLElement[] {
      return Array.from(fixture.nativeElement.querySelector('.sbb-sidebar-container').childNodes);
    }
  });

  describe('DOM position', () => {
    it('should project start sidebar before the content', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.componentInstance.position = 'start';
      fixture.detectChanges();

      const allNodes = getSidebarNodesArray(fixture);
      const sidebarIndex = allNodes.indexOf(fixture.nativeElement.querySelector('.sbb-sidebar'));
      const contentIndex = allNodes.indexOf(
        fixture.nativeElement.querySelector('.sbb-sidebar-content'),
      );

      expect(sidebarIndex)
        .withContext('Expected sidebar to be inside the container')
        .toBeGreaterThan(-1);
      expect(contentIndex)
        .withContext('Expected content to be inside the container')
        .toBeGreaterThan(-1);
      expect(sidebarIndex)
        .withContext('Expected sidebar to be before the content')
        .toBeLessThan(contentIndex);
    });

    it('should project end sidebar after the content', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.componentInstance.position = 'end';
      fixture.detectChanges();

      const allNodes = getSidebarNodesArray(fixture);
      const sidebarIndex = allNodes.indexOf(fixture.nativeElement.querySelector('.sbb-sidebar'));
      const contentIndex = allNodes.indexOf(
        fixture.nativeElement.querySelector('.sbb-sidebar-content'),
      );

      expect(sidebarIndex)
        .withContext('Expected sidebar to be inside the container')
        .toBeGreaterThan(-1);
      expect(contentIndex)
        .withContext('Expected content to be inside the container')
        .toBeGreaterThan(-1);
      expect(sidebarIndex)
        .withContext('Expected sidebar to be after the content')
        .toBeGreaterThan(contentIndex);
    });

    it('should move the sidebar before/after the content when its position changes after being initialized at `start`', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.componentInstance.position = 'start';
      fixture.detectChanges();

      const sidebar = fixture.nativeElement.querySelector('.sbb-sidebar');
      const content = fixture.nativeElement.querySelector('.sbb-sidebar-content');

      let allNodes = getSidebarNodesArray(fixture);
      const startSidebarIndex = allNodes.indexOf(sidebar);
      const startContentIndex = allNodes.indexOf(content);

      expect(startSidebarIndex)
        .withContext('Expected sidebar to be inside the container')
        .toBeGreaterThan(-1);
      expect(startContentIndex)
        .withContext('Expected content to be inside the container')
        .toBeGreaterThan(-1);
      expect(startSidebarIndex)
        .withContext('Expected sidebar to be before the content on init')
        .toBeLessThan(startContentIndex);

      fixture.componentInstance.position = 'end';
      fixture.detectChanges();
      allNodes = getSidebarNodesArray(fixture);

      expect(allNodes.indexOf(sidebar))
        .withContext('Expected sidebar to be after content when position changes to `end`')
        .toBeGreaterThan(allNodes.indexOf(content));

      fixture.componentInstance.position = 'start';
      fixture.detectChanges();
      allNodes = getSidebarNodesArray(fixture);

      expect(allNodes.indexOf(sidebar))
        .withContext('Expected sidebar to be before content when position changes back to `start`')
        .toBeLessThan(allNodes.indexOf(content));
    });

    it(
      'should move the sidebar before/after the content when its position changes after being ' +
        'initialized at `end`',
      () => {
        const fixture = TestBed.createComponent(BasicTestComponent);
        fixture.componentInstance.position = 'end';
        fixture.detectChanges();

        const sidebar = fixture.nativeElement.querySelector('.sbb-sidebar');
        const content = fixture.nativeElement.querySelector('.sbb-sidebar-content');

        let allNodes = getSidebarNodesArray(fixture);
        const startSidebarIndex = allNodes.indexOf(sidebar);
        const startContentIndex = allNodes.indexOf(content);

        expect(startSidebarIndex).toBeGreaterThan(
          -1,
          'Expected sidebar to be inside the container',
        );
        expect(startContentIndex).toBeGreaterThan(
          -1,
          'Expected content to be inside the container',
        );
        expect(startSidebarIndex).toBeGreaterThan(
          startContentIndex,
          'Expected sidebar after the content on init',
        );

        fixture.componentInstance.position = 'start';
        fixture.detectChanges();
        allNodes = getSidebarNodesArray(fixture);

        expect(allNodes.indexOf(sidebar)).toBeLessThan(
          allNodes.indexOf(content),
          'Expected sidebar before content when position changes to `start`',
        );

        fixture.componentInstance.position = 'end';
        fixture.detectChanges();
        allNodes = getSidebarNodesArray(fixture);

        expect(allNodes.indexOf(sidebar)).toBeGreaterThan(
          allNodes.indexOf(content),
          'Expected sidebar after content when position changes back to `end`',
        );
      },
    );

    function getSidebarNodesArray(fixture: ComponentFixture<any>): HTMLElement[] {
      return Array.from(fixture.nativeElement.querySelector('.sbb-sidebar-container').childNodes);
    }
  });
});

describe('SbbSidebarContainer', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule],
      providers: [PROVIDE_FAKE_MEDIA_MATCHER],
    });

    TestBed.compileComponents();
  }));

  registerClearMediaMatcher();

  it('should be able to open and close all sidebars', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);

    fixture.detectChanges();
    mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
    tick();

    const testComponent: SidebarContainerEmptyTestComponent =
      fixture.debugElement.componentInstance;
    const sidebar: SbbSidebar = fixture.debugElement.query(
      By.directive(SbbSidebar),
    ).componentInstance;

    expect(sidebar.opened).toBe(false);

    testComponent.sidebarContainer.open();
    fixture.detectChanges();
    tick();

    expect(sidebar.opened).toBe(true);

    testComponent.sidebarContainer.close();
    fixture.detectChanges();
    flush();

    expect(sidebar.opened).toBe(false);
  }));

  it('should animate the content when a sidebar is added at a later point', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarDelayedTestComponent);

    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector('.sbb-sidebar-content');

    expect(parseInt(contentElement.style.marginLeft, 10)).toBeFalsy();

    fixture.componentInstance.showSidebar = true;
    fixture.detectChanges();

    fixture.componentInstance.sidebar.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(parseInt(contentElement.style.marginLeft, 10)).toBeGreaterThan(0);
  }));

  it('should recalculate the margin if a sidebar is destroyed', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerStateChangesTestAppTestComponent);

    fixture.detectChanges();
    fixture.componentInstance.sidebar.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector('.sbb-sidebar-content');
    const initialMargin = parseInt(contentElement.style.marginLeft, 10);

    expect(initialMargin).toBeGreaterThan(0);

    fixture.componentInstance.renderSidebar = false;
    fixture.detectChanges();
    tick();

    expect(contentElement.style.marginLeft).toBe('');
  }));

  it('should recalculate the margin if the sidebar mode is changed', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerStateChangesTestAppTestComponent);
    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector('.sbb-sidebar-content');
    const initialMargin = parseInt(contentElement.style.marginLeft, 10);

    expect(initialMargin).toBeGreaterThan(0);

    mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
    tick();
    fixture.detectChanges();
    flush();

    expect(contentElement.style.marginLeft).toBe('');
  }));

  it('should not animate when the sidebar is open on load', fakeAsync(() => {
    TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [BrowserAnimationsModule, SbbIconTestingModule],
        providers: [PROVIDE_FAKE_MEDIA_MATCHER],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(SidebarSetToOpenedTrueTestComponent);

    fixture.detectChanges();
    tick();

    const container = fixture.debugElement.nativeElement.querySelector('.sbb-sidebar-container');

    expect(container.classList).not.toContain('sbb-sidebar-transition');
  }));

  it('should not set a style property if it would be zero', fakeAsync(() => {
    const fixture = TestBed.createComponent(ZeroWithSidebarTestComponent);
    fixture.detectChanges();
    mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
    tick();
    fixture.detectChanges();

    const content = fixture.debugElement.nativeElement.querySelector('.sbb-sidebar-content');
    expect(content.style.marginLeft)
      .withContext('Margin should be removed after sidebar close.')
      .toBe('');
    discardPeriodicTasks();
  }));

  it('should have a backdrop', fakeAsync(() => {
    const fixture = TestBed.createComponent(BasicTestComponent);
    fixture.detectChanges();
    mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
    tick();

    fixture.debugElement.query(By.directive(SbbSidebar)).componentInstance.open();

    fixture.detectChanges();
    flush();

    expect(fixture.nativeElement.querySelector('.sbb-sidebar-backdrop')).toBeTruthy();
  }));

  it('should expose a scrollable when the consumer has not specified sidebar content', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.sidebarContainer.scrollable instanceof CdkScrollable).toBe(
      true,
    );
  }));

  it('should expose a scrollable when the consumer has specified sidebar content', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerWithContentTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.sidebarContainer.scrollable instanceof CdkScrollable).toBe(
      true,
    );
  }));

  it('should clean up the sidebars stream on destroy', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);
    fixture.detectChanges();

    const spy = jasmine.createSpy('complete spy');
    const subscription = fixture.componentInstance.sidebarContainer._sidebars.changes.subscribe({
      complete: spy,
    });

    fixture.destroy();

    expect(spy).toHaveBeenCalled();
    subscription.unsubscribe();
  }));
});

describe('SbbSidebar Usage', () => {
  let fixture: ComponentFixture<SbbSidebarTestComponent>;
  let sidebar: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'link', pathMatch: 'full', component: SimpleRouteComponent },
        ]),
        SbbIconTestingModule,
      ],
      providers: [PROVIDE_FAKE_MEDIA_MATCHER],
    });

    TestBed.compileComponents();

    fixture = TestBed.createComponent(SbbSidebarTestComponent);
    sidebar = fixture.debugElement.query(By.directive(SbbSidebar));

    fixture.detectChanges();
  }));

  registerClearMediaMatcher();

  it('should not include any other elements than expansion panels and fieldsets', () => {
    expect(sidebar.nativeElement.textContent).not.toContain('SHOULD BE IGNORED');
  });

  it('should close sidebar on navigation start', fakeAsync(() => {
    mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
    tick();

    sidebar.componentInstance.open();
    fixture.detectChanges();
    flush();

    expect(sidebar.componentInstance.opened).toBe(true);

    const link = fixture.debugElement.query(By.css('a[sbbSidebarLink]'));
    link.nativeElement.click();

    fixture.detectChanges();
    flush();

    expect(sidebar.componentInstance.opened).toBe(false);
  }));

  it('should open and close sidebar with hamburger menu button', fakeAsync(() => {
    mediaMatcher.setMatchesQuery(Breakpoints.Mobile, true);
    tick();

    expect(sidebar.componentInstance.opened).toBe(false);

    const mobileOpenSidebarButton = fixture.debugElement.query(
      By.css('.sbb-sidebar-mobile-menu-bar-trigger'),
    )!.nativeElement;

    mobileOpenSidebarButton.click();

    expect(sidebar.componentInstance.opened).toBe(true);

    const mobileCloseSidebarButton = fixture.debugElement.query(
      By.css('.sbb-sidebar-mobile-menu-bar-close'),
    )!.nativeElement;

    mobileCloseSidebarButton.click();

    expect(sidebar.componentInstance.opened).toBe(false);
  }));
});

/** Test component that contains an SbbSidebarContainer and an empty sbb-sidebar-content. */
@Component({
  template: ` <sbb-sidebar-container>
    <sbb-sidebar></sbb-sidebar>
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class SidebarContainerEmptyTestComponent {
  @ViewChild(SbbSidebarContainer) sidebarContainer: SbbSidebarContainer;
}

/** Test component that contains an SbbSidebarContainer and one SbbSidebar. */
@Component({
  template: ` <sbb-sidebar-container (backdropClick)="backdropClicked()">
    <sbb-sidebar
      #sidebar="sbbSidebar"
      [position]="position"
      (opened)="open()"
      (openedStart)="openStart()"
      (closed)="close()"
      (closedStart)="closeStart()"
    >
      <fieldset>
        <button #sidebarButton>Content</button>
      </fieldset>
    </sbb-sidebar>
    <button (click)="sidebar.open()" class="open" #openButton></button>
    <button (click)="sidebar.close()" class="close" #closeButton></button>
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      tabindex="0"
      focusable="true"
      #svg
    >
      <circle cx="50" cy="50" r="50" />
    </svg>
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class BasicTestComponent {
  openCount = 0;
  openStartCount = 0;
  closeCount = 0;
  closeStartCount = 0;
  backdropClickedCount = 0;
  position = 'start';

  @ViewChild('sidebar') sidebar: SbbSidebar;
  @ViewChild('sidebarButton') sidebarButton: ElementRef<HTMLButtonElement>;
  @ViewChild('openButton') openButton: ElementRef<HTMLButtonElement>;
  @ViewChild('svg') svg: ElementRef<SVGElement>;
  @ViewChild('closeButton') closeButton: ElementRef<HTMLButtonElement>;

  open() {
    this.openCount++;
  }

  openStart() {
    this.openStartCount++;
  }

  close() {
    this.closeCount++;
  }

  closeStart() {
    this.closeStartCount++;
  }

  backdropClicked() {
    this.backdropClickedCount++;
  }
}

@Component({
  template: ` <sbb-sidebar-container>
    <sbb-sidebar #sidebar (opened)="openCallback()">
      <fieldset>Closed Sidebar.</fieldset>
    </sbb-sidebar>
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class SidebarSetToOpenedTrueTestComponent {
  openCallback = jasmine.createSpy('open callback');
}

@Component({
  template: ` <sbb-sidebar-container>
    <sbb-sidebar #sidebar>
      <fieldset>Closed Sidebar.</fieldset>
    </sbb-sidebar>
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class SidebarOpenBindingTestComponent {}

@Component({
  template: ` <sbb-sidebar-container>
    <sbb-sidebar #sidebar1></sbb-sidebar>
    <sbb-sidebar #sidebar2></sbb-sidebar>
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class TwoSidebarsTestComponent {}

@Component({
  // Note: we use inputs here, because they're guaranteed
  // to be focusable across all platforms.
  template: ` <sbb-sidebar-container>
    <sbb-sidebar>
      <fieldset>
        <input type="text" class="input1" />
      </fieldset>
    </sbb-sidebar>
    <input type="text" class="input2" />
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class SidebarWithFocusableElementsTestComponent {}

@Component({
  template: ` <sbb-sidebar-container>
    <sbb-sidebar>
      <fieldset><button disabled>Not focusable</button></fieldset>
    </sbb-sidebar>
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class SidebarWithoutFocusableElementsTestComponent {}

@Component({
  template: `
    <sbb-sidebar-container>
      @if (showSidebar) {
        <sbb-sidebar #sidebar><fieldset>Sidebar</fieldset></sbb-sidebar>
      }
    </sbb-sidebar-container>
  `,
  standalone: true,
  imports: [SbbSidebarModule],
})
class SidebarDelayedTestComponent {
  @ViewChild(SbbSidebar) sidebar: SbbSidebar;
  showSidebar = false;
}

@Component({
  template: ` <sbb-sidebar-container [dir]="direction">
    @if (renderSidebar) {
      <sbb-sidebar style="width:100px"></sbb-sidebar>
    }
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class SidebarContainerStateChangesTestAppTestComponent {
  @ViewChild(SbbSidebar) sidebar: SbbSidebar;
  @ViewChild(SbbSidebarContainer) sidebarContainer: SbbSidebarContainer;

  direction: Direction = 'ltr';
  renderSidebar = true;
}

@Component({
  template: ` <sbb-sidebar-container>
    <sbb-sidebar>
      <fieldset>Sidebar</fieldset>
    </sbb-sidebar>
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class ZeroWithSidebarTestComponent {
  @ViewChild(SbbSidebar) sidebar: SbbSidebar;
  @ViewChild(SbbSidebarContainer) sidebarContainer: SbbSidebarContainer;
}

@Component({
  template: `
    <sbb-sidebar-container>
      <sbb-sidebar><fieldset>Sidebar</fieldset></sbb-sidebar>
      <sbb-sidebar-content>Content</sbb-sidebar-content>
    </sbb-sidebar-container>
  `,
  standalone: true,
  imports: [SbbSidebarModule],
})
class SidebarContainerWithContentTestComponent {
  @ViewChild(SbbSidebarContainer) sidebarContainer: SbbSidebarContainer;
}

@Component({
  // Note that we need the `ng-container` with the `ngSwitch` so that
  // there's a directive between the container and the sidebar.
  template: ` <sbb-sidebar-container #container>
    @if (true) {
      <sbb-sidebar #sidebar><fieldset>Sidebar</fieldset></sbb-sidebar>
    }
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [SbbSidebarModule],
})
class IndirectDescendantSidebarTestComponent {
  @ViewChild('container') container: SbbSidebarContainer;
  @ViewChild('sidebar') sidebar: SbbSidebar;
}

@Component({
  template: `
    <sbb-sidebar-container #outerContainer>
      <sbb-sidebar #outerSidebar><fieldset>Sidebar</fieldset></sbb-sidebar>
      <sbb-sidebar-content>
        <sbb-sidebar-container #innerContainer>
          <sbb-sidebar #innerSidebar>Sidebar</sbb-sidebar>
        </sbb-sidebar-container>
      </sbb-sidebar-content>
    </sbb-sidebar-container>
  `,
  standalone: true,
  imports: [SbbSidebarModule],
})
class NestedSidebarContainersTestComponent {
  @ViewChild('outerContainer') outerContainer: SbbSidebarContainer;
  @ViewChild('outerSidebar') outerSidebar: SbbSidebar;
  @ViewChild('innerContainer') innerContainer: SbbSidebarContainer;
  @ViewChild('innerSidebar') innerSidebar: SbbSidebar;
}

@Component({
  template: `<sbb-sidebar-container>
    <sbb-sidebar role="navigation">
      <sbb-expansion-panel expanded>
        <sbb-expansion-panel-header>Title</sbb-expansion-panel-header>
        <a sbbSidebarLink routerLink="./link">Link</a>
      </sbb-expansion-panel>
      <fieldset>
        <legend>Fieldset Example</legend>
        <button sbb-button>Random Content</button>
      </fieldset>
      <a>SHOULD BE IGNORED</a>
    </sbb-sidebar>
    <sbb-sidebar-content role="main">
      Content
      <router-outlet></router-outlet>
    </sbb-sidebar-content>
  </sbb-sidebar-container>`,
  standalone: true,
  imports: [
    SbbSidebarModule,
    SbbButtonModule,
    RouterOutlet,
    RouterLink,
    SbbAccordionModule,
    SbbIconTestingModule,
  ],
})
class SbbSidebarTestComponent {}

@Component({
  template: '',
  standalone: true,
})
class SimpleRouteComponent {}

import { A11yModule } from '@angular/cdk/a11y';
import { Direction } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Platform, PlatformModule } from '@angular/cdk/platform';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  async,
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchKeyboardEvent,
} from '@sbb-esta/angular-core/testing';

import { SbbSidebarModule } from '../sidebar-module';

import { SbbIconSidebar, SbbIconSidebarContainer } from './icon-sidebar';

describe('SbbIconSidebar', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, A11yModule, PlatformModule, NoopAnimationsModule, CommonModule],
      declarations: [
        BasicTestComponent,
        SidebarContainerNoSidebarTestComponent,
        SidebarSetToOpenedFalseTestComponent,
        SidebarSetToOpenedTrueTestComponent,
        TwoSidebarsTestComponent,
        SidebarWithFocusableElementsTestComponent,
        SidebarOpenBindingTestComponent,
        SidebarWithoutFocusableElementsTestComponent,
        IndirectDescendantSidebarTestComponent,
        NestedSidebarContainersTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('methods', () => {
    it('should be able to open', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const container = fixture.debugElement.query(By.css('sbb-icon-sidebar-container'))!
        .nativeElement;

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

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const container = fixture.debugElement.query(By.css('sbb-icon-sidebar-container'))!
        .nativeElement;

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
      const sidebar: SbbIconSidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!
        .componentInstance;

      sidebar.open().then((result) => expect(result).toBe('open'));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should resolve the close method promise with the new state of the sidebar', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!;
      const sidebarInstance: SbbIconSidebar = sidebar.componentInstance;

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

    it('should close when pressing escape', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);

      fixture.detectChanges();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!;

      sidebar.componentInstance.open();
      fixture.detectChanges();
      tick();

      expect(testComponent.openCount).toBe(1, 'Expected one open event.');
      expect(testComponent.openStartCount).toBe(1, 'Expected one open start event.');
      expect(testComponent.closeCount).toBe(0, 'Expected no close events.');
      expect(testComponent.closeStartCount).toBe(0, 'Expected no close start events.');

      const event = dispatchKeyboardEvent(sidebar.nativeElement, 'keydown', ESCAPE);
      fixture.detectChanges();
      flush();

      expect(testComponent.closeCount).toBe(1, 'Expected one close event.');
      expect(testComponent.closeStartCount).toBe(1, 'Expected one close start event.');
      expect(event.defaultPrevented).toBe(true);
    }));

    it('should not close when pressing escape with a modifier', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);

      fixture.detectChanges();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!;

      sidebar.componentInstance.open();
      fixture.detectChanges();
      tick();

      expect(testComponent.closeCount).toBe(0, 'Expected no close events.');
      expect(testComponent.closeStartCount).toBe(0, 'Expected no close start events.');

      const event = createKeyboardEvent('keydown', ESCAPE, undefined, { alt: true });
      dispatchEvent(sidebar.nativeElement, event);
      fixture.detectChanges();
      flush();

      expect(testComponent.closeCount).toBe(0, 'Expected still no close events.');
      expect(testComponent.closeStartCount).toBe(0, 'Expected still no close start events.');
      expect(event.defaultPrevented).toBe(false);
    }));

    it('should fire the open event when open on init', fakeAsync(() => {
      const fixture = TestBed.createComponent(SidebarSetToOpenedTrueTestComponent);

      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.openCallback).toHaveBeenCalledTimes(1);
    }));

    it('should not close by pressing escape when disableClose is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      const testComponent = fixture.debugElement.componentInstance;
      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!;

      sidebar.componentInstance.disableClose = true;
      sidebar.componentInstance.open();
      fixture.detectChanges();
      tick();

      dispatchKeyboardEvent(sidebar.nativeElement, 'keydown', ESCAPE);
      fixture.detectChanges();
      tick();

      expect(testComponent.closeCount).toBe(0);
      expect(testComponent.closeStartCount).toBe(0);
    }));

    it('should not close by clicking on the backdrop when disableClose is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      const testComponent = fixture.debugElement.componentInstance;
      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;

      sidebar.disableClose = true;
      sidebar.open();
      fixture.detectChanges();
      tick();

      fixture.debugElement.query(By.css('.sbb-sidebar-backdrop'))!.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(testComponent.closeCount).toBe(0);
      expect(testComponent.closeStartCount).toBe(0);
    }));

    it('should restore focus on close if backdrop has been clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;
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

      expect(document.activeElement).toBe(
        openButton,
        'Expected focus to be restored to the open button on close.'
      );
    }));

    it('should restore focus on close if focus is on sidebar', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);

      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;
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

      expect(document.activeElement).toBe(
        openButton,
        'Expected focus to be restored to the open button on close.'
      );
    }));

    it('should restore focus to an SVG element', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;
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

      expect(document.activeElement).toBe(
        svg,
        'Expected focus to be restored to the SVG element on close.'
      );
    }));

    it('should not restore focus on close if focus is outside sidebar', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      const sidebar: SbbIconSidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!
        .componentInstance;
      fixture.detectChanges();

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

      expect(document.activeElement).toBe(
        closeButton,
        'Expected focus not to be restored to the open button on close.'
      );
    }));

    it('should pick up sidebars that are not direct descendants', fakeAsync(() => {
      const fixture = TestBed.createComponent(IndirectDescendantSidebarTestComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.sidebar.opened).toBe(false);

      fixture.componentInstance.container.open();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.sidebar.opened).toBe(true);
    }));

    it('should not pick up sidebars from nested containers', fakeAsync(() => {
      const fixture = TestBed.createComponent(NestedSidebarContainersTestComponent);
      const instance = fixture.componentInstance;
      fixture.detectChanges();

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
    it('should correctly parse opened="false"', () => {
      const fixture = TestBed.createComponent(SidebarSetToOpenedFalseTestComponent);

      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;

      expect((sidebar as SbbIconSidebar).opened).toBe(false);
    });

    it('should correctly parse opened="true"', () => {
      const fixture = TestBed.createComponent(SidebarSetToOpenedTrueTestComponent);

      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;

      expect((sidebar as SbbIconSidebar).opened).toBe(true);
    });

    it('should remove align attr from DOM', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const sidebarEl = fixture.debugElement.query(By.css('sbb-icon-sidebar'))!.nativeElement;
      expect(sidebarEl.hasAttribute('align')).toBe(
        false,
        'Expected sidebar not to have a native align attribute.'
      );
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

    it('should bind 2-way bind on opened property', fakeAsync(() => {
      const fixture = TestBed.createComponent(SidebarOpenBindingTestComponent);
      fixture.detectChanges();

      const sidebar: SbbIconSidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!
        .componentInstance;

      sidebar.open();
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.isOpen).toBe(true);
    }));

    it('should not throw when a two-way binding is toggled quickly while animating', fakeAsync(() => {
      TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [SbbSidebarModule, BrowserAnimationsModule],
          declarations: [SidebarOpenBindingTestComponent],
        })
        .compileComponents();

      const fixture = TestBed.createComponent(SidebarOpenBindingTestComponent);
      fixture.detectChanges();

      // Note that we need actual timeouts and the `BrowserAnimationsModule`
      // in order to test it correctly.
      setTimeout(() => {
        fixture.componentInstance.isOpen = !fixture.componentInstance.isOpen;
        expect(() => fixture.detectChanges()).not.toThrow();

        setTimeout(() => {
          fixture.componentInstance.isOpen = !fixture.componentInstance.isOpen;
          expect(() => fixture.detectChanges()).not.toThrow();
        }, 1);

        tick(1);
      }, 1);

      tick(1);
    }));
  });

  describe('focus trapping behavior', () => {
    let fixture: ComponentFixture<SidebarWithFocusableElementsTestComponent>;
    let testComponent: SidebarWithFocusableElementsTestComponent;
    let sidebar: SbbIconSidebar;
    let firstFocusableElement: HTMLElement;
    let lastFocusableElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SidebarWithFocusableElementsTestComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      sidebar = fixture.debugElement.query(By.directive(SbbIconSidebar))!.componentInstance;
      firstFocusableElement = fixture.debugElement.query(By.css('.input1'))!.nativeElement;
      lastFocusableElement = fixture.debugElement.query(By.css('.input2'))!.nativeElement;
      lastFocusableElement.focus();
    });

    it('should trap focus when opened in "over" mode', fakeAsync(() => {
      testComponent.mode = 'over';
      fixture.detectChanges();
      lastFocusableElement.focus();

      sidebar.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(firstFocusableElement);
    }));

    it('should trap focus when opened in "push" mode', fakeAsync(() => {
      testComponent.mode = 'push';
      fixture.detectChanges();
      lastFocusableElement.focus();

      sidebar.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(firstFocusableElement);
    }));

    it('should not auto-focus by default when opened in "side" mode', fakeAsync(() => {
      testComponent.mode = 'side';
      fixture.detectChanges();
      lastFocusableElement.focus();

      sidebar.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(lastFocusableElement);
    }));

    it('should auto-focus when opened in "side" mode when enabled explicitly', fakeAsync(() => {
      sidebar.autoFocus = true;
      testComponent.mode = 'side';
      fixture.detectChanges();
      lastFocusableElement.focus();

      sidebar.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(firstFocusableElement);
    }));

    it('should focus the sidebar if there are no focusable elements', fakeAsync(() => {
      fixture.destroy();

      const nonFocusableFixture = TestBed.createComponent(
        SidebarWithoutFocusableElementsTestComponent
      );
      const sidebarEl = nonFocusableFixture.debugElement.query(By.directive(SbbIconSidebar))!;
      nonFocusableFixture.detectChanges();

      sidebarEl.componentInstance.open();
      nonFocusableFixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(sidebarEl.nativeElement);
    }));

    it('should be able to disable auto focus', fakeAsync(() => {
      sidebar.autoFocus = false;
      testComponent.mode = 'push';
      fixture.detectChanges();
      lastFocusableElement.focus();

      sidebar.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).not.toBe(firstFocusableElement);
    }));

    it('should update the focus trap enable state if the mode changes while open', fakeAsync(() => {
      testComponent.mode = 'side';
      fixture.detectChanges();

      sidebar.open();
      fixture.detectChanges();
      tick();

      const anchors = Array.from<HTMLElement>(
        fixture.nativeElement.querySelectorAll('.cdk-focus-trap-anchor')
      );

      expect(anchors.every((anchor) => !anchor.hasAttribute('tabindex'))).toBe(
        true,
        'Expected focus trap anchors to be disabled in side mode.'
      );

      testComponent.mode = 'over';
      fixture.detectChanges();

      expect(anchors.every((anchor) => anchor.getAttribute('tabindex') === '0')).toBe(
        true,
        'Expected focus trap anchors to be enabled in over mode.'
      );
    }));
  });
});

describe('SbbIconSidebarContainer', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, A11yModule, PlatformModule, NoopAnimationsModule],
      declarations: [
        SidebarContainerEmptyTestComponent,
        SidebarDelayedTestComponent,
        SidebarSetToOpenedTrueTestComponent,
        SidebarContainerStateChangesTestAppTestComponent,
        AutosizeSidebarTestComponent,
        BasicTestComponent,
        SidebarContainerWithContentTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  it('should be able to open and close all sidebars', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);

    fixture.detectChanges();

    const testComponent: SidebarContainerEmptyTestComponent =
      fixture.debugElement.componentInstance;
    const sidebars = fixture.debugElement.queryAll(By.directive(SbbIconSidebar));

    expect(sidebars.every((sidebar) => sidebar.componentInstance.opened)).toBe(false);

    testComponent.sidebarContainer.open();
    fixture.detectChanges();
    tick();

    expect(sidebars.every((sidebar) => sidebar.componentInstance.opened)).toBe(true);

    testComponent.sidebarContainer.close();
    fixture.detectChanges();
    flush();

    expect(sidebars.every((sidebar) => sidebar.componentInstance.opened)).toBe(false);
  }));

  it('should animate the content when a sidebar is added at a later point', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarDelayedTestComponent);

    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector(
      '.sbb-icon-sidebar-content'
    );

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

    const contentElement = fixture.debugElement.nativeElement.querySelector(
      '.sbb-icon-sidebar-content'
    );
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
    fixture.componentInstance.sidebar.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector(
      '.sbb-icon-sidebar-content'
    );
    const initialMargin = parseInt(contentElement.style.marginLeft, 10);

    expect(initialMargin).toBeGreaterThan(0);

    fixture.componentInstance.mode = 'over';
    fixture.detectChanges();

    expect(contentElement.style.marginLeft).toBe('');
  }));

  it('should not animate when the sidebar is open on load', fakeAsync(() => {
    TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [SbbSidebarModule, BrowserAnimationsModule],
        declarations: [SidebarSetToOpenedTrueTestComponent],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(SidebarSetToOpenedTrueTestComponent);

    fixture.detectChanges();
    tick();

    const container = fixture.debugElement.nativeElement.querySelector(
      '.sbb-icon-sidebar-container'
    );

    expect(container.classList).not.toContain('sbb-sidebar-transition');
  }));

  it('should recalculate the margin if a sidebar changes size while open in autosize mode', fakeAsync(
    inject([Platform], (platform: Platform) => {
      const fixture = TestBed.createComponent(AutosizeSidebarTestComponent);

      fixture.detectChanges();
      fixture.componentInstance.sidebar.open();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // IE and Edge are flaky in when they update the styles.
      // For them we fall back to checking whether the proper method was called.
      const isFlaky = platform.EDGE || platform.TRIDENT;
      const contentEl = fixture.debugElement.nativeElement.querySelector(
        '.sbb-icon-sidebar-content'
      );
      const initialMargin = parseInt(contentEl.style.marginLeft, 10);

      if (isFlaky) {
        spyOn(fixture.componentInstance.sidebarContainer, 'updateContentMargins');
      } else {
        expect(initialMargin).toBeGreaterThan(0);
      }

      fixture.componentInstance.fillerWidth = 200;
      fixture.detectChanges();
      tick(10);
      fixture.detectChanges();

      if (isFlaky) {
        expect(fixture.componentInstance.sidebarContainer.updateContentMargins).toHaveBeenCalled();
      } else {
        expect(parseInt(contentEl.style.marginLeft, 10)).toBeGreaterThan(initialMargin);
      }

      discardPeriodicTasks();
    })
  ));

  it('should not set a style property if it would be zero', fakeAsync(() => {
    const fixture = TestBed.createComponent(AutosizeSidebarTestComponent);
    fixture.detectChanges();

    const content = fixture.debugElement.nativeElement.querySelector('.sbb-icon-sidebar-content');
    expect(content.style.marginLeft).toBe('', 'Margin should be omitted when sidebar is closed');

    // Open the sidebar and resolve the open animation.
    fixture.componentInstance.sidebar.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(content.style.marginLeft).not.toBe('', 'Margin should be present when sidebar is open');

    // Close the sidebar and resolve the close animation.
    fixture.componentInstance.sidebar.close();
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(content.style.marginLeft).toBe('', 'Margin should be removed after sidebar close.');

    discardPeriodicTasks();
  }));

  it('should be able to toggle whether the container has a backdrop', fakeAsync(() => {
    const fixture = TestBed.createComponent(BasicTestComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sbb-sidebar-backdrop')).toBeTruthy();

    fixture.componentInstance.hasBackdrop = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sbb-sidebar-backdrop')).toBeFalsy();
  }));

  it('should be able to explicitly enable the backdrop in `side` mode', fakeAsync(() => {
    const fixture = TestBed.createComponent(BasicTestComponent);
    const root = fixture.nativeElement;
    fixture.detectChanges();

    fixture.componentInstance.sidebar.mode = 'side';
    fixture.detectChanges();
    fixture.componentInstance.sidebar.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    let backdrop = root.querySelector('.sbb-sidebar-backdrop.sbb-sidebar-shown');

    expect(backdrop).toBeFalsy();

    fixture.componentInstance.hasBackdrop = true;
    fixture.detectChanges();
    backdrop = root.querySelector('.sbb-sidebar-backdrop.sbb-sidebar-shown');

    expect(backdrop).toBeTruthy();
    expect(fixture.componentInstance.sidebar.opened).toBe(true);

    backdrop.click();
    fixture.detectChanges();
    tick();

    expect(fixture.componentInstance.sidebar.opened).toBe(false);
  }));

  it('should expose a scrollable when the consumer has not specified sidebar content', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerEmptyTestComponent);

    fixture.detectChanges();
    console.error(fixture.componentInstance.sidebarContainer.scrollable);

    expect(fixture.componentInstance.sidebarContainer.scrollable instanceof CdkScrollable).toBe(
      true
    );
  }));

  it('should expose a scrollable when the consumer has specified sidebar content', fakeAsync(() => {
    const fixture = TestBed.createComponent(SidebarContainerWithContentTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.sidebarContainer.scrollable instanceof CdkScrollable).toBe(
      true
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

/** Test component that contains an SbbIconSidebarContainer but no SbbIconSidebar. */
@Component({ template: `<sbb-icon-sidebar-container></sbb-icon-sidebar-container>` })
class SidebarContainerNoSidebarTestComponent {}

/** Test component that contains an SbbIconSidebarContainer and an empty sbb-icon-sidebar-content. */
@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar></sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarContainerEmptyTestComponent {
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;
}

/** Test component that contains an SbbIconSidebarContainer and one SbbIconSidebar. */
@Component({
  template: ` <sbb-icon-sidebar-container
    (backdropClick)="backdropClicked()"
    [hasBackdrop]="hasBackdrop"
  >
    <sbb-icon-sidebar
      #sidebar="sbbIconSidebar"
      (opened)="open()"
      (openedStart)="openStart()"
      (closed)="close()"
      (closedStart)="closeStart()"
    >
      <button #sidebarButton>Content</button>
    </sbb-icon-sidebar>
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
  </sbb-icon-sidebar-container>`,
})
class BasicTestComponent {
  openCount = 0;
  openStartCount = 0;
  closeCount = 0;
  closeStartCount = 0;
  backdropClickedCount = 0;
  hasBackdrop: boolean | null = null;

  @ViewChild('sidebar') sidebar: SbbIconSidebar;
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
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar mode="side" opened="false">
      Closed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarSetToOpenedFalseTestComponent {}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar mode="side" opened="true" (opened)="openCallback()">
      Closed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarSetToOpenedTrueTestComponent {
  openCallback = jasmine.createSpy('open callback');
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar mode="side" [(opened)]="isOpen">
      Closed Sidebar.
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarOpenBindingTestComponent {
  isOpen = false;
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar #sidebar1></sbb-icon-sidebar>
    <sbb-icon-sidebar #sidebar2></sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class TwoSidebarsTestComponent {}

@Component({
  // Note: we use inputs here, because they're guaranteed
  // to be focusable across all platforms.
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar [mode]="mode">
      <input type="text" class="input1" />
    </sbb-icon-sidebar>
    <input type="text" class="input2" />
  </sbb-icon-sidebar-container>`,
})
class SidebarWithFocusableElementsTestComponent {
  mode: string = 'over';
}

@Component({
  template: ` <sbb-icon-sidebar-container>
    <sbb-icon-sidebar mode="over">
      <button disabled>Not focusable</button>
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarWithoutFocusableElementsTestComponent {}

@Component({
  template: `
    <sbb-icon-sidebar-container>
      <sbb-icon-sidebar *ngIf="showSidebar" #sidebar mode="side">Sidebar</sbb-icon-sidebar>
    </sbb-icon-sidebar-container>
  `,
})
class SidebarDelayedTestComponent {
  @ViewChild(SbbIconSidebar) sidebar: SbbIconSidebar;
  showSidebar = false;
}

@Component({
  template: ` <sbb-icon-sidebar-container [dir]="direction">
    <sbb-icon-sidebar *ngIf="renderSidebar" [mode]="mode" style="width:100px"></sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class SidebarContainerStateChangesTestAppTestComponent {
  @ViewChild(SbbIconSidebar) sidebar: SbbIconSidebar;
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;

  direction: Direction = 'ltr';
  mode = 'side';
  renderSidebar = true;
}

@Component({
  template: ` <sbb-icon-sidebar-container autosize style="min-height: 200px;">
    <sbb-icon-sidebar mode="push">
      Text
      <div [style.width.px]="fillerWidth" style="height: 200px; background: red;"></div>
    </sbb-icon-sidebar>
  </sbb-icon-sidebar-container>`,
})
class AutosizeSidebarTestComponent {
  @ViewChild(SbbIconSidebar) sidebar: SbbIconSidebar;
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;
  fillerWidth = 0;
}

@Component({
  template: `
    <sbb-icon-sidebar-container>
      <sbb-icon-sidebar>Sidebar</sbb-icon-sidebar>
      <sbb-icon-sidebar-content>Content</sbb-icon-sidebar-content>
    </sbb-icon-sidebar-container>
  `,
})
class SidebarContainerWithContentTestComponent {
  @ViewChild(SbbIconSidebarContainer) sidebarContainer: SbbIconSidebarContainer;
}

@Component({
  // Note that we need the `ng-container` with the `ngSwitch` so that
  // there's a directive between the container and the sidebar.
  template: ` <sbb-icon-sidebar-container #container>
    <ng-container [ngSwitch]="true">
      <sbb-icon-sidebar #sidebar>Sidebar</sbb-icon-sidebar>
    </ng-container>
  </sbb-icon-sidebar-container>`,
})
class IndirectDescendantSidebarTestComponent {
  @ViewChild('container') container: SbbIconSidebarContainer;
  @ViewChild('sidebar') sidebar: SbbIconSidebar;
}

@Component({
  template: `
    <sbb-icon-sidebar-container #outerContainer>
      <sbb-icon-sidebar #outerSidebar>Sidebar</sbb-icon-sidebar>
      <sbb-icon-sidebar-content>
        <sbb-icon-sidebar-container #innerContainer>
          <sbb-icon-sidebar #innerSidebar>Sidebar</sbb-icon-sidebar>
        </sbb-icon-sidebar-container>
      </sbb-icon-sidebar-content>
    </sbb-icon-sidebar-container>
  `,
})
class NestedSidebarContainersTestComponent {
  @ViewChild('outerContainer') outerContainer: SbbIconSidebarContainer;
  @ViewChild('outerSidebar') outerSidebar: SbbIconSidebar;
  @ViewChild('innerContainer') innerContainer: SbbIconSidebarContainer;
  @ViewChild('innerSidebar') innerSidebar: SbbIconSidebar;
}

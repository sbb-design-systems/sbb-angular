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

import { SbbDrawer, SbbDrawerContainer, SbbSidebarModule } from './index';

describe('SbbDrawer', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, A11yModule, PlatformModule, NoopAnimationsModule, CommonModule],
      declarations: [
        BasicTestComponent,
        DrawerContainerNoDrawerTestComponent,
        DrawerSetToOpenedFalseTestComponent,
        DrawerSetToOpenedTrueTestComponent,
        TwoDrawersTestComponent,
        DrawerWithFocusableElementsTestComponent,
        DrawerOpenBindingTestComponent,
        DrawerWithoutFocusableElementsTestComponent,
        IndirectDescendantDrawerTestComponent,
        NestedDrawerContainersTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('methods', () => {
    it('should be able to open', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const container = fixture.debugElement.query(By.css('sbb-drawer-container'))!.nativeElement;

      fixture.debugElement.query(By.css('.open'))!.nativeElement.click();
      fixture.detectChanges();

      expect(testComponent.openCount).toBe(0);
      expect(testComponent.openStartCount).toBe(0);
      expect(container.classList).not.toContain('sbb-drawer-container-has-open');

      tick();
      expect(testComponent.openStartCount).toBe(1);
      fixture.detectChanges();

      expect(testComponent.openCount).toBe(1);
      expect(testComponent.openStartCount).toBe(1);
      expect(container.classList).toContain('sbb-drawer-container-has-open');
    }));

    it('should be able to close', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const testComponent: BasicTestComponent = fixture.debugElement.componentInstance;
      const container = fixture.debugElement.query(By.css('sbb-drawer-container'))!.nativeElement;

      fixture.debugElement.query(By.css('.open'))!.nativeElement.click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.close'))!.nativeElement.click();
      fixture.detectChanges();

      expect(testComponent.closeCount).toBe(0);
      expect(testComponent.closeStartCount).toBe(0);
      expect(container.classList).toContain('sbb-drawer-container-has-open');

      flush();
      expect(testComponent.closeStartCount).toBe(1);
      fixture.detectChanges();

      expect(testComponent.closeCount).toBe(1);
      expect(testComponent.closeStartCount).toBe(1);
      expect(container.classList).not.toContain('sbb-drawer-container-has-open');
    }));

    it('should resolve the open method promise with the new state of the drawer', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      const drawer: SbbDrawer = fixture.debugElement.query(By.directive(SbbDrawer))!
        .componentInstance;

      drawer.open().then((result) => expect(result).toBe('open'));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should resolve the close method promise with the new state of the drawer', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!;
      const drawerInstance: SbbDrawer = drawer.componentInstance;

      drawerInstance.open();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      drawerInstance.close().then((result) => expect(result).toBe('close'));
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

    it('does not throw when created without a drawer', fakeAsync(() => {
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

      fixture.debugElement.query(By.css('.sbb-drawer-backdrop'))!.nativeElement.click();
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
      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!;

      drawer.componentInstance.open();
      fixture.detectChanges();
      tick();

      expect(testComponent.openCount).toBe(1, 'Expected one open event.');
      expect(testComponent.openStartCount).toBe(1, 'Expected one open start event.');
      expect(testComponent.closeCount).toBe(0, 'Expected no close events.');
      expect(testComponent.closeStartCount).toBe(0, 'Expected no close start events.');

      const event = dispatchKeyboardEvent(drawer.nativeElement, 'keydown', ESCAPE);
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
      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!;

      drawer.componentInstance.open();
      fixture.detectChanges();
      tick();

      expect(testComponent.closeCount).toBe(0, 'Expected no close events.');
      expect(testComponent.closeStartCount).toBe(0, 'Expected no close start events.');

      const event = createKeyboardEvent('keydown', ESCAPE, undefined, { alt: true });
      dispatchEvent(drawer.nativeElement, event);
      fixture.detectChanges();
      flush();

      expect(testComponent.closeCount).toBe(0, 'Expected still no close events.');
      expect(testComponent.closeStartCount).toBe(0, 'Expected still no close start events.');
      expect(event.defaultPrevented).toBe(false);
    }));

    it('should fire the open event when open on init', fakeAsync(() => {
      const fixture = TestBed.createComponent(DrawerSetToOpenedTrueTestComponent);

      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.openCallback).toHaveBeenCalledTimes(1);
    }));

    it('should not close by pressing escape when disableClose is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      const testComponent = fixture.debugElement.componentInstance;
      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!;

      drawer.componentInstance.disableClose = true;
      drawer.componentInstance.open();
      fixture.detectChanges();
      tick();

      dispatchKeyboardEvent(drawer.nativeElement, 'keydown', ESCAPE);
      fixture.detectChanges();
      tick();

      expect(testComponent.closeCount).toBe(0);
      expect(testComponent.closeStartCount).toBe(0);
    }));

    it('should not close by clicking on the backdrop when disableClose is set', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      const testComponent = fixture.debugElement.componentInstance;
      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!.componentInstance;

      drawer.disableClose = true;
      drawer.open();
      fixture.detectChanges();
      tick();

      fixture.debugElement.query(By.css('.sbb-drawer-backdrop'))!.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(testComponent.closeCount).toBe(0);
      expect(testComponent.closeStartCount).toBe(0);
    }));

    it('should restore focus on close if backdrop has been clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!.componentInstance;
      const openButton = fixture.componentInstance.openButton.nativeElement;

      openButton.focus();
      drawer.open();
      fixture.detectChanges();
      flush();

      const backdrop = fixture.nativeElement.querySelector('.sbb-drawer-backdrop');
      expect(backdrop).toBeTruthy();

      // Ensure the element that has been focused on drawer open is blurred. This simulates
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

    it('should restore focus on close if focus is on drawer', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);

      fixture.detectChanges();

      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!.componentInstance;
      const openButton = fixture.componentInstance.openButton.nativeElement;
      const drawerButton = fixture.componentInstance.drawerButton.nativeElement;

      openButton.focus();
      drawer.open();
      fixture.detectChanges();
      flush();
      drawerButton.focus();

      drawer.close();
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

      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!.componentInstance;
      const svg = fixture.componentInstance.svg.nativeElement;
      const drawerButton = fixture.componentInstance.drawerButton.nativeElement;

      svg.focus();
      drawer.open();
      fixture.detectChanges();
      flush();
      drawerButton.focus();

      drawer.close();
      fixture.detectChanges();
      flush();

      expect(document.activeElement).toBe(
        svg,
        'Expected focus to be restored to the SVG element on close.'
      );
    }));

    it('should not restore focus on close if focus is outside drawer', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      const drawer: SbbDrawer = fixture.debugElement.query(By.directive(SbbDrawer))!
        .componentInstance;
      fixture.detectChanges();

      const openButton = fixture.componentInstance.openButton.nativeElement;
      const closeButton = fixture.componentInstance.closeButton.nativeElement;

      openButton.focus();
      drawer.open();

      fixture.detectChanges();
      tick();
      closeButton.focus();

      drawer.close();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(
        closeButton,
        'Expected focus not to be restored to the open button on close.'
      );
    }));

    it('should pick up drawers that are not direct descendants', fakeAsync(() => {
      const fixture = TestBed.createComponent(IndirectDescendantDrawerTestComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.drawer.opened).toBe(false);

      fixture.componentInstance.container.open();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.drawer.opened).toBe(true);
    }));

    it('should not pick up drawers from nested containers', fakeAsync(() => {
      const fixture = TestBed.createComponent(NestedDrawerContainersTestComponent);
      const instance = fixture.componentInstance;
      fixture.detectChanges();

      expect(instance.outerDrawer.opened).toBe(false);
      expect(instance.innerDrawer.opened).toBe(false);

      instance.outerContainer.open();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(instance.outerDrawer.opened).toBe(true);
      expect(instance.innerDrawer.opened).toBe(false);

      instance.innerContainer.open();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(instance.outerDrawer.opened).toBe(true);
      expect(instance.innerDrawer.opened).toBe(true);
    }));
  });

  describe('attributes', () => {
    it('should correctly parse opened="false"', () => {
      const fixture = TestBed.createComponent(DrawerSetToOpenedFalseTestComponent);

      fixture.detectChanges();

      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!.componentInstance;

      expect((drawer as SbbDrawer).opened).toBe(false);
    });

    it('should correctly parse opened="true"', () => {
      const fixture = TestBed.createComponent(DrawerSetToOpenedTrueTestComponent);

      fixture.detectChanges();

      const drawer = fixture.debugElement.query(By.directive(SbbDrawer))!.componentInstance;

      expect((drawer as SbbDrawer).opened).toBe(true);
    });

    it('should remove align attr from DOM', () => {
      const fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();

      const drawerEl = fixture.debugElement.query(By.css('sbb-drawer'))!.nativeElement;
      expect(drawerEl.hasAttribute('align')).toBe(
        false,
        'Expected drawer not to have a native align attribute.'
      );
    });

    it('should throw when multiple drawers are included', fakeAsync(() => {
      const fixture = TestBed.createComponent(TwoDrawersTestComponent);

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
      const fixture = TestBed.createComponent(DrawerOpenBindingTestComponent);
      fixture.detectChanges();

      const drawer: SbbDrawer = fixture.debugElement.query(By.directive(SbbDrawer))!
        .componentInstance;

      drawer.open();
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.isOpen).toBe(true);
    }));

    it('should not throw when a two-way binding is toggled quickly while animating', fakeAsync(() => {
      TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [SbbSidebarModule, BrowserAnimationsModule],
          declarations: [DrawerOpenBindingTestComponent],
        })
        .compileComponents();

      const fixture = TestBed.createComponent(DrawerOpenBindingTestComponent);
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
    let fixture: ComponentFixture<DrawerWithFocusableElementsTestComponent>;
    let testComponent: DrawerWithFocusableElementsTestComponent;
    let drawer: SbbDrawer;
    let firstFocusableElement: HTMLElement;
    let lastFocusableElement: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(DrawerWithFocusableElementsTestComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      drawer = fixture.debugElement.query(By.directive(SbbDrawer))!.componentInstance;
      firstFocusableElement = fixture.debugElement.query(By.css('.input1'))!.nativeElement;
      lastFocusableElement = fixture.debugElement.query(By.css('.input2'))!.nativeElement;
      lastFocusableElement.focus();
    });

    it('should trap focus when opened in "over" mode', fakeAsync(() => {
      testComponent.mode = 'over';
      fixture.detectChanges();
      lastFocusableElement.focus();

      drawer.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(firstFocusableElement);
    }));

    it('should trap focus when opened in "push" mode', fakeAsync(() => {
      testComponent.mode = 'push';
      fixture.detectChanges();
      lastFocusableElement.focus();

      drawer.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(firstFocusableElement);
    }));

    it('should not auto-focus by default when opened in "side" mode', fakeAsync(() => {
      testComponent.mode = 'side';
      fixture.detectChanges();
      lastFocusableElement.focus();

      drawer.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(lastFocusableElement);
    }));

    it('should auto-focus when opened in "side" mode when enabled explicitly', fakeAsync(() => {
      drawer.autoFocus = true;
      testComponent.mode = 'side';
      fixture.detectChanges();
      lastFocusableElement.focus();

      drawer.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(firstFocusableElement);
    }));

    it('should focus the drawer if there are no focusable elements', fakeAsync(() => {
      fixture.destroy();

      const nonFocusableFixture = TestBed.createComponent(
        DrawerWithoutFocusableElementsTestComponent
      );
      const drawerEl = nonFocusableFixture.debugElement.query(By.directive(SbbDrawer))!;
      nonFocusableFixture.detectChanges();

      drawerEl.componentInstance.open();
      nonFocusableFixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(drawerEl.nativeElement);
    }));

    it('should be able to disable auto focus', fakeAsync(() => {
      drawer.autoFocus = false;
      testComponent.mode = 'push';
      fixture.detectChanges();
      lastFocusableElement.focus();

      drawer.open();
      fixture.detectChanges();
      tick();

      expect(document.activeElement).not.toBe(firstFocusableElement);
    }));

    it('should update the focus trap enable state if the mode changes while open', fakeAsync(() => {
      testComponent.mode = 'side';
      fixture.detectChanges();

      drawer.open();
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

describe('SbbDrawerContainer', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SbbSidebarModule, A11yModule, PlatformModule, NoopAnimationsModule],
      declarations: [
        DrawerContainerEmptyTestComponent,
        DrawerDelayedTestComponent,
        DrawerSetToOpenedTrueTestComponent,
        DrawerContainerStateChangesTestAppTestComponent,
        AutosizeDrawerTestComponent,
        BasicTestComponent,
        DrawerContainerWithContentTestComponent,
      ],
    });

    TestBed.compileComponents();
  }));

  it('should be able to open and close all drawers', fakeAsync(() => {
    const fixture = TestBed.createComponent(DrawerContainerEmptyTestComponent);

    fixture.detectChanges();

    const testComponent: DrawerContainerEmptyTestComponent = fixture.debugElement.componentInstance;
    const drawers = fixture.debugElement.queryAll(By.directive(SbbDrawer));

    expect(drawers.every((drawer) => drawer.componentInstance.opened)).toBe(false);

    testComponent.drawerContainer.open();
    fixture.detectChanges();
    tick();

    expect(drawers.every((drawer) => drawer.componentInstance.opened)).toBe(true);

    testComponent.drawerContainer.close();
    fixture.detectChanges();
    flush();

    expect(drawers.every((drawer) => drawer.componentInstance.opened)).toBe(false);
  }));

  it('should animate the content when a drawer is added at a later point', fakeAsync(() => {
    const fixture = TestBed.createComponent(DrawerDelayedTestComponent);

    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector('.sbb-drawer-content');

    expect(parseInt(contentElement.style.marginLeft, 10)).toBeFalsy();

    fixture.componentInstance.showDrawer = true;
    fixture.detectChanges();

    fixture.componentInstance.drawer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(parseInt(contentElement.style.marginLeft, 10)).toBeGreaterThan(0);
  }));

  it('should recalculate the margin if a drawer is destroyed', fakeAsync(() => {
    const fixture = TestBed.createComponent(DrawerContainerStateChangesTestAppTestComponent);

    fixture.detectChanges();
    fixture.componentInstance.drawer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector('.sbb-drawer-content');
    const initialMargin = parseInt(contentElement.style.marginLeft, 10);

    expect(initialMargin).toBeGreaterThan(0);

    fixture.componentInstance.renderDrawer = false;
    fixture.detectChanges();
    tick();

    expect(contentElement.style.marginLeft).toBe('');
  }));

  it('should recalculate the margin if the drawer mode is changed', fakeAsync(() => {
    const fixture = TestBed.createComponent(DrawerContainerStateChangesTestAppTestComponent);

    fixture.detectChanges();
    fixture.componentInstance.drawer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const contentElement = fixture.debugElement.nativeElement.querySelector('.sbb-drawer-content');
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
        declarations: [DrawerSetToOpenedTrueTestComponent],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(DrawerSetToOpenedTrueTestComponent);

    fixture.detectChanges();
    tick();

    const container = fixture.debugElement.nativeElement.querySelector('.sbb-drawer-container');

    expect(container.classList).not.toContain('sbb-drawer-transition');
  }));

  it('should recalculate the margin if a drawer changes size while open in autosize mode', fakeAsync(
    inject([Platform], (platform: Platform) => {
      const fixture = TestBed.createComponent(AutosizeDrawerTestComponent);

      fixture.detectChanges();
      fixture.componentInstance.drawer.open();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // IE and Edge are flaky in when they update the styles.
      // For them we fall back to checking whether the proper method was called.
      const isFlaky = platform.EDGE || platform.TRIDENT;
      const contentEl = fixture.debugElement.nativeElement.querySelector('.sbb-drawer-content');
      const initialMargin = parseInt(contentEl.style.marginLeft, 10);

      if (isFlaky) {
        spyOn(fixture.componentInstance.drawerContainer, 'updateContentMargins');
      } else {
        expect(initialMargin).toBeGreaterThan(0);
      }

      fixture.componentInstance.fillerWidth = 200;
      fixture.detectChanges();
      tick(10);
      fixture.detectChanges();

      if (isFlaky) {
        expect(fixture.componentInstance.drawerContainer.updateContentMargins).toHaveBeenCalled();
      } else {
        expect(parseInt(contentEl.style.marginLeft, 10)).toBeGreaterThan(initialMargin);
      }

      discardPeriodicTasks();
    })
  ));

  it('should not set a style property if it would be zero', fakeAsync(() => {
    const fixture = TestBed.createComponent(AutosizeDrawerTestComponent);
    fixture.detectChanges();

    const content = fixture.debugElement.nativeElement.querySelector('.sbb-drawer-content');
    expect(content.style.marginLeft).toBe('', 'Margin should be omitted when drawer is closed');

    // Open the drawer and resolve the open animation.
    fixture.componentInstance.drawer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(content.style.marginLeft).not.toBe('', 'Margin should be present when drawer is open');

    // Close the drawer and resolve the close animation.
    fixture.componentInstance.drawer.close();
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(content.style.marginLeft).toBe('', 'Margin should be removed after drawer close.');

    discardPeriodicTasks();
  }));

  it('should be able to toggle whether the container has a backdrop', fakeAsync(() => {
    const fixture = TestBed.createComponent(BasicTestComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sbb-drawer-backdrop')).toBeTruthy();

    fixture.componentInstance.hasBackdrop = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sbb-drawer-backdrop')).toBeFalsy();
  }));

  it('should be able to explicitly enable the backdrop in `side` mode', fakeAsync(() => {
    const fixture = TestBed.createComponent(BasicTestComponent);
    const root = fixture.nativeElement;
    fixture.detectChanges();

    fixture.componentInstance.drawer.mode = 'side';
    fixture.detectChanges();
    fixture.componentInstance.drawer.open();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    let backdrop = root.querySelector('.sbb-drawer-backdrop.sbb-drawer-shown');

    expect(backdrop).toBeFalsy();

    fixture.componentInstance.hasBackdrop = true;
    fixture.detectChanges();
    backdrop = root.querySelector('.sbb-drawer-backdrop.sbb-drawer-shown');

    expect(backdrop).toBeTruthy();
    expect(fixture.componentInstance.drawer.opened).toBe(true);

    backdrop.click();
    fixture.detectChanges();
    tick();

    expect(fixture.componentInstance.drawer.opened).toBe(false);
  }));

  it('should expose a scrollable when the consumer has not specified drawer content', fakeAsync(() => {
    const fixture = TestBed.createComponent(DrawerContainerEmptyTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.drawerContainer.scrollable instanceof CdkScrollable).toBe(
      true
    );
  }));

  it('should expose a scrollable when the consumer has specified drawer content', fakeAsync(() => {
    const fixture = TestBed.createComponent(DrawerContainerWithContentTestComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.drawerContainer.scrollable instanceof CdkScrollable).toBe(
      true
    );
  }));

  it('should clean up the drawers stream on destroy', fakeAsync(() => {
    const fixture = TestBed.createComponent(DrawerContainerEmptyTestComponent);
    fixture.detectChanges();

    const spy = jasmine.createSpy('complete spy');
    const subscription = fixture.componentInstance.drawerContainer._drawers.changes.subscribe({
      complete: spy,
    });

    fixture.destroy();

    expect(spy).toHaveBeenCalled();
    subscription.unsubscribe();
  }));
});

/** Test component that contains an SbbDrawerContainer but no SbbDrawer. */
@Component({ template: `<sbb-drawer-container></sbb-drawer-container>` })
class DrawerContainerNoDrawerTestComponent {}

/** Test component that contains an SbbDrawerContainer and an empty sbb-drawer-content. */
@Component({
  template: ` <sbb-drawer-container>
    <sbb-drawer></sbb-drawer>
  </sbb-drawer-container>`,
})
class DrawerContainerEmptyTestComponent {
  @ViewChild(SbbDrawerContainer) drawerContainer: SbbDrawerContainer;
}

/** Test component that contains an SbbDrawerContainer and one SbbDrawer. */
@Component({
  template: ` <sbb-drawer-container (backdropClick)="backdropClicked()" [hasBackdrop]="hasBackdrop">
    <sbb-drawer
      #drawer="sbbDrawer"
      (opened)="open()"
      (openedStart)="openStart()"
      (closed)="close()"
      (closedStart)="closeStart()"
    >
      <button #drawerButton>Content</button>
    </sbb-drawer>
    <button (click)="drawer.open()" class="open" #openButton></button>
    <button (click)="drawer.close()" class="close" #closeButton></button>
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      tabindex="0"
      focusable="true"
      #svg
    >
      <circle cx="50" cy="50" r="50" />
    </svg>
  </sbb-drawer-container>`,
})
class BasicTestComponent {
  openCount = 0;
  openStartCount = 0;
  closeCount = 0;
  closeStartCount = 0;
  backdropClickedCount = 0;
  hasBackdrop: boolean | null = null;

  @ViewChild('drawer') drawer: SbbDrawer;
  @ViewChild('drawerButton') drawerButton: ElementRef<HTMLButtonElement>;
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
  template: ` <sbb-drawer-container>
    <sbb-drawer #drawer mode="side" opened="false">
      Closed Drawer.
    </sbb-drawer>
  </sbb-drawer-container>`,
})
class DrawerSetToOpenedFalseTestComponent {}

@Component({
  template: ` <sbb-drawer-container>
    <sbb-drawer #drawer mode="side" opened="true" (opened)="openCallback()">
      Closed Drawer.
    </sbb-drawer>
  </sbb-drawer-container>`,
})
class DrawerSetToOpenedTrueTestComponent {
  openCallback = jasmine.createSpy('open callback');
}

@Component({
  template: ` <sbb-drawer-container>
    <sbb-drawer #drawer mode="side" [(opened)]="isOpen">
      Closed Drawer.
    </sbb-drawer>
  </sbb-drawer-container>`,
})
class DrawerOpenBindingTestComponent {
  isOpen = false;
}

@Component({
  template: ` <sbb-drawer-container>
    <sbb-drawer #drawer1></sbb-drawer>
    <sbb-drawer #drawer2></sbb-drawer>
  </sbb-drawer-container>`,
})
class TwoDrawersTestComponent {}

@Component({
  // Note: we use inputs here, because they're guaranteed
  // to be focusable across all platforms.
  template: ` <sbb-drawer-container>
    <sbb-drawer [mode]="mode">
      <input type="text" class="input1" />
    </sbb-drawer>
    <input type="text" class="input2" />
  </sbb-drawer-container>`,
})
class DrawerWithFocusableElementsTestComponent {
  mode: string = 'over';
}

@Component({
  template: ` <sbb-drawer-container>
    <sbb-drawer mode="over">
      <button disabled>Not focusable</button>
    </sbb-drawer>
  </sbb-drawer-container>`,
})
class DrawerWithoutFocusableElementsTestComponent {}

@Component({
  template: `
    <sbb-drawer-container>
      <sbb-drawer *ngIf="showDrawer" #drawer mode="side">Drawer</sbb-drawer>
    </sbb-drawer-container>
  `,
})
class DrawerDelayedTestComponent {
  @ViewChild(SbbDrawer) drawer: SbbDrawer;
  showDrawer = false;
}

@Component({
  template: ` <sbb-drawer-container [dir]="direction">
    <sbb-drawer *ngIf="renderDrawer" [mode]="mode" style="width:100px"></sbb-drawer>
  </sbb-drawer-container>`,
})
class DrawerContainerStateChangesTestAppTestComponent {
  @ViewChild(SbbDrawer) drawer: SbbDrawer;
  @ViewChild(SbbDrawerContainer) drawerContainer: SbbDrawerContainer;

  direction: Direction = 'ltr';
  mode = 'side';
  renderDrawer = true;
}

@Component({
  template: ` <sbb-drawer-container autosize style="min-height: 200px;">
    <sbb-drawer mode="push">
      Text
      <div [style.width.px]="fillerWidth" style="height: 200px; background: red;"></div>
    </sbb-drawer>
  </sbb-drawer-container>`,
})
class AutosizeDrawerTestComponent {
  @ViewChild(SbbDrawer) drawer: SbbDrawer;
  @ViewChild(SbbDrawerContainer) drawerContainer: SbbDrawerContainer;
  fillerWidth = 0;
}

@Component({
  template: `
    <sbb-drawer-container>
      <sbb-drawer>Drawer</sbb-drawer>
      <sbb-drawer-content>Content</sbb-drawer-content>
    </sbb-drawer-container>
  `,
})
class DrawerContainerWithContentTestComponent {
  @ViewChild(SbbDrawerContainer) drawerContainer: SbbDrawerContainer;
}

@Component({
  // Note that we need the `ng-container` with the `ngSwitch` so that
  // there's a directive between the container and the drawer.
  template: ` <sbb-drawer-container #container>
    <ng-container [ngSwitch]="true">
      <sbb-drawer #drawer>Drawer</sbb-drawer>
    </ng-container>
  </sbb-drawer-container>`,
})
class IndirectDescendantDrawerTestComponent {
  @ViewChild('container') container: SbbDrawerContainer;
  @ViewChild('drawer') drawer: SbbDrawer;
}

@Component({
  template: `
    <sbb-drawer-container #outerContainer>
      <sbb-drawer #outerDrawer>Drawer</sbb-drawer>
      <sbb-drawer-content>
        <sbb-drawer-container #innerContainer>
          <sbb-drawer #innerDrawer>Drawer</sbb-drawer>
        </sbb-drawer-container>
      </sbb-drawer-content>
    </sbb-drawer-container>
  `,
})
class NestedDrawerContainersTestComponent {
  @ViewChild('outerContainer') outerContainer: SbbDrawerContainer;
  @ViewChild('outerDrawer') outerDrawer: SbbDrawer;
  @ViewChild('innerContainer') innerContainer: SbbDrawerContainer;
  @ViewChild('innerDrawer') innerDrawer: SbbDrawer;
}

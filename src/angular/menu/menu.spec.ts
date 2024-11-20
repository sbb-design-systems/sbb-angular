import { FocusMonitor } from '@angular/cdk/a11y';
import {
  DOWN_ARROW,
  END,
  ENTER,
  ESCAPE,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  TAB,
} from '@angular/cdk/keycodes';
import { MediaMatcher } from '@angular/cdk/layout';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Provider,
  QueryList,
  TemplateRef,
  Type,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Breakpoints, SCALING_FACTOR_4K, SCALING_FACTOR_5K } from '@sbb-esta/angular/core';
import {
  createKeyboardEvent,
  createMouseEvent,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  FakeMediaMatcher,
  patchElementFocus,
  switchToLean,
} from '@sbb-esta/angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { Subject } from 'rxjs';

import {
  SbbMenu,
  SbbMenuInheritedTriggerContext,
  SbbMenuItem,
  SbbMenuModule,
  SbbMenuPanel,
  SbbMenuPositionX,
  SbbMenuPositionY,
  SbbMenuTrigger,
  SBB_MENU_DEFAULT_OPTIONS,
  SBB_MENU_INHERITED_TRIGGER_CONTEXT,
} from './index';
import { SbbMenuTriggerContext, SBB_MENU_SCROLL_STRATEGY } from './menu-trigger';

let mediaMatcher: FakeMediaMatcher;

const PROVIDE_FAKE_MEDIA_MATCHER = {
  provide: MediaMatcher,
  useFactory: () => {
    mediaMatcher = new FakeMediaMatcher();
    mediaMatcher.defaultMatches = false; // enforce desktop view
    return mediaMatcher;
  },
};

describe('SbbMenu', () => {
  let overlayContainerElement: HTMLElement;
  let focusMonitor: FocusMonitor;
  let viewportRuler: ViewportRuler;

  function createComponent<T>(
    component: Type<T>,
    providers: Provider[] = [],
    declarations: any[] = [],
  ): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [SbbMenuModule, NoopAnimationsModule, SbbIconModule, SbbIconTestingModule],
      declarations: [component, ...declarations],
      providers,
    });

    overlayContainerElement = TestBed.inject(OverlayContainer).getContainerElement();
    focusMonitor = TestBed.inject(FocusMonitor);
    viewportRuler = TestBed.inject(ViewportRuler);
    const fixture = TestBed.createComponent<T>(component);
    window.scroll(0, 0);
    return fixture;
  }

  it('should aria-controls the menu panel', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);
    expect(fixture.componentInstance.triggerEl.nativeElement.getAttribute('aria-controls')).toBe(
      fixture.componentInstance.menu.panelId,
    );
  }));

  it('should set aria-haspopup based on whether a menu is assigned', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerElement = fixture.componentInstance.triggerEl.nativeElement;

    expect(triggerElement.getAttribute('aria-haspopup')).toBe('menu');

    fixture.componentInstance.trigger.menu = null;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(triggerElement.hasAttribute('aria-haspopup')).toBe(false);
  }));

  it('should open the menu as an idempotent operation', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(overlayContainerElement.textContent).toContain('Item');
      expect(overlayContainerElement.textContent).toContain('Disabled');
    }).not.toThrowError();
  }));

  it('should close the menu when a click occurs outside the menu', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();

    const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');
    backdrop.click();
    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.textContent).toBe('');
  }));

  it('should be able to remove the backdrop', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.menu.hasBackdrop = false;
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeFalsy();
  }));

  it('should set the correct aria-haspopup value on the trigger element', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerElement = fixture.componentInstance.triggerEl.nativeElement;

    expect(triggerElement.getAttribute('aria-haspopup')).toBe('menu');
  }));

  it('should be able to remove the backdrop on repeat openings', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    // Start off with a backdrop.
    expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    // Change `hasBackdrop` after the first open.
    fixture.componentInstance.menu.hasBackdrop = false;
    fixture.detectChanges();

    // Reopen the menu.
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeFalsy();
  }));

  it('should restore focus to the trigger when the menu was opened by keyboard', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    // A click without a mousedown before it is considered a keyboard open.
    triggerEl.click();
    fixture.detectChanges();

    expect(overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(triggerEl);
  }));

  it('should not restore focus to the trigger if focus restoration is disabled', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    fixture.componentInstance.restoreFocus = false;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    // A click without a mousedown before it is considered a keyboard open.
    triggerEl.click();
    fixture.detectChanges();

    expect(overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).not.toBe(triggerEl);
  }));

  it('should be able to move focus in the closed event', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    const instance = fixture.componentInstance;
    fixture.detectChanges();
    const triggerEl = instance.triggerEl.nativeElement;
    const button = document.createElement('button');
    button.setAttribute('tabindex', '0');
    document.body.appendChild(button);

    triggerEl.click();
    fixture.detectChanges();

    const subscription = instance.trigger.menuClosed.subscribe(() => button.focus());
    instance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(button);
    button.remove();
    subscription.unsubscribe();
  }));

  it('should restore focus to the trigger immediately once the menu is closed', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    // A click without a mousedown before it is considered a keyboard open.
    triggerEl.click();
    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    // Note: don't add a `tick` here since we're testing
    // that focus is restored before the animation is done.

    expect(document.activeElement).toBe(triggerEl);
    tick(500);
  }));

  it('should move focus to another item if the active item is destroyed', fakeAsync(() => {
    const fixture = createComponent(MenuWithRepeatedItems, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    triggerEl.click();
    fixture.detectChanges();
    tick(500);

    const items = overlayContainerElement.querySelectorAll('.sbb-menu-panel .sbb-menu-item');

    expect(document.activeElement).toBe(items[0]);

    fixture.componentInstance.items.shift();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(items[1]);
  }));

  it('should be able to set a custom class on the backdrop', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.componentInstance.backdropClass = 'custom-backdrop';
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');

    expect(backdrop.classList).toContain('custom-backdrop');
  }));

  it('should be able to set a custom class on the overlay panel', fakeAsync(() => {
    const optionsProvider = {
      provide: SBB_MENU_DEFAULT_OPTIONS,
      useValue: { overlayPanelClass: 'custom-panel-class' },
    };
    const fixture = createComponent(SimpleMenu, [optionsProvider], [FakeIcon]);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const overlayPane = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-pane');

    expect(overlayPane.classList).toContain('custom-panel-class');
  }));

  it('should be able to set a custom classes on the overlay panel', fakeAsync(() => {
    const optionsProvider = {
      provide: SBB_MENU_DEFAULT_OPTIONS,
      useValue: { overlayPanelClass: ['custom-panel-class-1', 'custom-panel-class-2'] },
    };
    const fixture = createComponent(SimpleMenu, [optionsProvider], [FakeIcon]);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const overlayPane = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-pane');

    expect(overlayPane.classList).toContain('custom-panel-class-1');
    expect(overlayPane.classList).toContain('custom-panel-class-2');
  }));

  it('should restore focus to the root trigger when the menu was opened by mouse', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;
    dispatchFakeEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();

    expect(overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(triggerEl);
  }));

  it('should restore focus to the root trigger when the menu was opened by touch', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;
    dispatchFakeEvent(triggerEl, 'touchstart');
    triggerEl.click();
    fixture.detectChanges();

    expect(overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    flush();

    expect(document.activeElement).toBe(triggerEl);
  }));

  it('should scroll the panel to the top on open, when it is scrollable', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    // Add 50 items to make the menu scrollable
    fixture.componentInstance.extraItems = new Array(50).fill('Hello there');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    tick(50);

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;
    dispatchFakeEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();

    // Flush due to the additional tick that is necessary for the FocusMonitor.
    flush();

    expect(overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!.scrollTop).toBe(0);
  }));

  it('should set the proper focus origin when restoring focus after opening by keyboard', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    patchElementFocus(triggerEl);
    focusMonitor.monitor(triggerEl, false);
    triggerEl.click(); // A click without a mousedown before it is considered a keyboard open.
    fixture.detectChanges();
    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(triggerEl.classList).toContain('cdk-program-focused');
    focusMonitor.stopMonitoring(triggerEl);
  }));

  it('should set the proper focus origin when restoring focus after opening by mouse', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    dispatchMouseEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();
    patchElementFocus(triggerEl);
    focusMonitor.monitor(triggerEl, false);
    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(triggerEl.classList).toContain('cdk-mouse-focused');
    focusMonitor.stopMonitoring(triggerEl);
  }));

  it('should set proper focus origin when right clicking on trigger, before opening by keyboard', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    patchElementFocus(triggerEl);
    focusMonitor.monitor(triggerEl, false);

    // Trigger a fake right click.
    dispatchEvent(triggerEl, createMouseEvent('mousedown', 50, 100, undefined, undefined, 2));

    // A click without a left button mousedown before it is considered a keyboard open.
    triggerEl.click();
    fixture.detectChanges();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(triggerEl.classList).toContain('cdk-program-focused');
    focusMonitor.stopMonitoring(triggerEl);
  }));

  it('should set the proper focus origin when restoring focus after opening by touch', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    dispatchMouseEvent(triggerEl, 'touchstart');
    triggerEl.click();
    fixture.detectChanges();
    patchElementFocus(triggerEl);
    focusMonitor.monitor(triggerEl, false);
    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
    flush();

    expect(triggerEl.classList).toContain('cdk-touch-focused');
    focusMonitor.stopMonitoring(triggerEl);
  }));

  it('should close the menu when pressing ESCAPE', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;
    const event = dispatchKeyboardEvent(panel, 'keydown', ESCAPE);

    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.textContent).toBe('');
    expect(event.defaultPrevented).toBe(true);
  }));

  it('should not close the menu when pressing ESCAPE with a modifier', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;
    const event = createKeyboardEvent('keydown', ESCAPE, undefined, { alt: true });

    dispatchEvent(panel, event);
    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.textContent).toBeTruthy();
    expect(event.defaultPrevented).toBe(false);
  }));

  it('should open a custom menu', () => {
    const fixture = createComponent(CustomMenu, [], [CustomMenuPanel]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.componentInstance.trigger.openMenu();

      expect(overlayContainerElement.textContent).toContain('Custom Menu header');
      expect(overlayContainerElement.textContent).toContain('Custom Content');
    }).not.toThrowError();
  });

  it('should transfer any custom classes from the host to the overlay', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.componentInstance.panelClass = 'custom-one custom-two';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const menuEl = fixture.debugElement.query(By.css('sbb-menu'))!.nativeElement;
    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;

    expect(menuEl.classList).not.toContain('custom-one');
    expect(menuEl.classList).not.toContain('custom-two');

    expect(panel.classList).toContain('custom-one');
    expect(panel.classList).toContain('custom-two');
  }));

  it('should not remove sbb-elevation class from overlay when panelClass is changed', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.componentInstance.panelClass = 'custom-one';
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;

    expect(panel.classList).toContain('custom-one');
    fixture.changeDetectorRef.markForCheck();
    expect(panel.classList).toContain('sbb-elevation-z4');

    fixture.componentInstance.panelClass = 'custom-two';
    fixture.detectChanges();

    expect(panel.classList).not.toContain('custom-one');
    expect(panel.classList).toContain('custom-two');
    expect(panel.classList)
      .withContext('Expected sbb-elevation-z4 not to be removed')
      .toContain('sbb-elevation-z4');
  }));

  it('should set the "menu" role on the overlay panel', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const menuPanel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper');

    expect(menuPanel).withContext('Expected to find a menu panel.').toBeTruthy();

    const role = menuPanel ? menuPanel.getAttribute('role') : '';
    expect(role).withContext('Expected panel to have the "menu" role.').toBe('menu');
  }));

  it('should forward ARIA attributes to the menu panel', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    const instance = fixture.componentInstance;
    fixture.detectChanges();
    instance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const menuPanel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;
    expect(menuPanel.hasAttribute('aria-label')).toBe(false);
    expect(menuPanel.hasAttribute('aria-labelledby')).toBe(false);
    expect(menuPanel.hasAttribute('aria-describedby')).toBe(false);

    // Note that setting all of these at the same time is invalid,
    // but it's up to the consumer to handle it correctly.
    instance.ariaLabel = 'Custom aria-label';
    instance.ariaLabelledby = 'custom-labelled-by';
    instance.ariaDescribedby = 'custom-described-by';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(menuPanel.getAttribute('aria-label')).toBe('Custom aria-label');
    expect(menuPanel.getAttribute('aria-labelledby')).toBe('custom-labelled-by');
    expect(menuPanel.getAttribute('aria-describedby')).toBe('custom-described-by');

    // Change these to empty strings to make sure that we don't preserve empty attributes.
    instance.ariaLabel = instance.ariaLabelledby = instance.ariaDescribedby = '';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(menuPanel.hasAttribute('aria-label')).toBe(false);
    expect(menuPanel.hasAttribute('aria-labelledby')).toBe(false);
    expect(menuPanel.hasAttribute('aria-describedby')).toBe(false);
  }));

  it('should set the "menuitem" role on the items by default', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const items = Array.from(overlayContainerElement.querySelectorAll('.sbb-menu-item'));

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.getAttribute('role') === 'menuitem')).toBe(true);
  }));

  it('should be able to set an alternate role on the menu items', fakeAsync(() => {
    const fixture = createComponent(MenuWithCheckboxItems);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const items = Array.from(overlayContainerElement.querySelectorAll('.sbb-menu-item'));

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.getAttribute('role') === 'menuitemcheckbox')).toBe(true);
  }));

  it('should not change focus origin if origin not specified for menu items', fakeAsync(() => {
    const fixture = createComponent(MenuWithCheckboxItems);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const [firstMenuItemDebugEl, secondMenuItemDebugEl] = fixture.debugElement.queryAll(
      By.css('.sbb-menu-item'),
    )!;

    const firstMenuItemInstance = firstMenuItemDebugEl.componentInstance as SbbMenuItem;
    const secondMenuItemInstance = secondMenuItemDebugEl.componentInstance as SbbMenuItem;

    firstMenuItemDebugEl.nativeElement.blur();
    firstMenuItemInstance.focus('mouse');
    secondMenuItemDebugEl.nativeElement.blur();
    secondMenuItemInstance.focus();
    tick(500);

    expect(secondMenuItemDebugEl.nativeElement.classList).toContain('cdk-focused');
    expect(secondMenuItemDebugEl.nativeElement.classList).toContain('cdk-mouse-focused');
  }));

  it('should not throw an error on destroy', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    expect(fixture.destroy.bind(fixture)).not.toThrow();
  });

  it('should be able to extract the menu item text', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.first.getLabel()).toBe('Item');
  });

  it('should filter out icon nodes when figuring out the label', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const items = fixture.componentInstance.items.toArray();
    expect(items[2].getLabel()).toBe('Item with an icon');
  }));

  it('should get the label of an item if the text is not in a direct descendant node', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const items = fixture.componentInstance.items.toArray();
    expect(items[3].getLabel()).toBe('Item with text inside span');
  }));

  it('should set the proper focus origin when opening by mouse', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    spyOn(fixture.componentInstance.items.first, 'focus').and.callThrough();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    dispatchMouseEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();
    tick(500);

    expect(fixture.componentInstance.items.first.focus).toHaveBeenCalledWith('mouse');
  }));

  it('should set the proper focus origin when opening by touch', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    spyOn(fixture.componentInstance.items.first, 'focus').and.callThrough();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    dispatchMouseEvent(triggerEl, 'touchstart');
    triggerEl.click();
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.items.first.focus).toHaveBeenCalledWith('touch');
  }));

  it('should set the proper origin when calling focusFirstItem after the opening sequence has started', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    spyOn(fixture.componentInstance.items.first, 'focus').and.callThrough();

    fixture.componentInstance.trigger.openMenu();
    fixture.componentInstance.menu.focusFirstItem('mouse');
    fixture.componentInstance.menu.focusFirstItem('touch');
    fixture.detectChanges();

    expect(fixture.componentInstance.items.first.focus).toHaveBeenCalledOnceWith('touch');
  });

  it('should close the menu when using the CloseScrollStrategy', fakeAsync(() => {
    const scrolledSubject = new Subject<void>();
    const fixture = createComponent(
      SimpleMenu,
      [
        { provide: ScrollDispatcher, useFactory: () => ({ scrolled: () => scrolledSubject }) },
        {
          provide: SBB_MENU_SCROLL_STRATEGY,
          deps: [Overlay],
          useFactory: (overlay: Overlay) => () => overlay.scrollStrategies.close(),
        },
      ],
      [FakeIcon],
    );
    fixture.detectChanges();
    const trigger = fixture.componentInstance.trigger;

    trigger.openMenu();
    fixture.detectChanges();

    expect(trigger.menuOpen).toBe(true);

    scrolledSubject.next();
    tick(500);

    expect(trigger.menuOpen).toBe(false);
  }));

  it('should switch to keyboard focus when using the keyboard after opening using the mouse', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.detectChanges();
    fixture.componentInstance.triggerEl.nativeElement.click();
    fixture.detectChanges();

    const panel = document.querySelector('.sbb-menu-panel-wrapper')! as HTMLElement;
    const items: HTMLElement[] = Array.from(
      panel.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]'),
    );

    items.forEach((item) => patchElementFocus(item));

    tick(500);
    tick();
    fixture.detectChanges();
    expect(items.some((item) => item.classList.contains('cdk-keyboard-focused'))).toBe(false);

    dispatchKeyboardEvent(panel, 'keydown', DOWN_ARROW);
    fixture.detectChanges();

    // Flush due to the additional tick that is necessary for the FocusMonitor.
    flush();

    // We skip to the third item, because the second one is disabled.
    expect(items[2].classList).toContain('cdk-focused');
    expect(items[2].classList).toContain('cdk-keyboard-focused');
  }));

  it('should set the keyboard focus origin when opened using the keyboard', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const trigger = fixture.componentInstance.triggerEl.nativeElement;

    // Note that we dispatch both a `click` and a `keydown` to imitate the browser behavior.
    dispatchKeyboardEvent(trigger, 'keydown', ENTER);
    trigger.click();
    fixture.detectChanges();

    const items = Array.from<HTMLElement>(
      document.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]'),
    );

    items.forEach((item) => patchElementFocus(item));
    tick(500);
    tick();
    fixture.detectChanges();

    expect(items[0].classList).toContain('cdk-keyboard-focused');
  }));

  it('should toggle the aria-expanded attribute on the trigger', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
  }));

  it('should toggle aria-expanded on the trigger in an OnPush component', fakeAsync(() => {
    const fixture = createComponent(SimpleMenuOnPush, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);

    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
  }));

  it('should throw if assigning a menu that contains the trigger', fakeAsync(() => {
    expect(() => {
      const fixture = createComponent(InvalidRecursiveMenu, [], [FakeIcon]);
      fixture.detectChanges();
      tick(500);
    }).toThrowError(/menu cannot contain its own trigger/);
  }));

  it('should be able to swap out a menu after the first time it is opened', fakeAsync(() => {
    const fixture = createComponent(DynamicPanelMenu);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('One');
    expect(overlayContainerElement.textContent).not.toContain('Two');

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toBe('');

    fixture.componentInstance.trigger.menu = fixture.componentInstance.secondMenu;
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).not.toContain('One');
    expect(overlayContainerElement.textContent).toContain('Two');

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toBe('');
  }));

  it('should focus the first item when pressing home', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    // Reset the automatic focus when the menu is opened.
    (document.activeElement as HTMLElement)?.blur();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;
    const items = Array.from(panel.querySelectorAll('.sbb-menu-item')) as HTMLElement[];
    items.forEach(patchElementFocus);

    // Focus the last item since focus starts from the first one.
    items[items.length - 1].focus();
    fixture.detectChanges();

    spyOn(items[0], 'focus').and.callThrough();

    const event = dispatchKeyboardEvent(panel, 'keydown', HOME);
    fixture.detectChanges();

    expect(items[0].focus).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
    flush();
  }));

  it('should not focus the first item when pressing home with a modifier key', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;
    const items = Array.from(panel.querySelectorAll('.sbb-menu-item')) as HTMLElement[];
    items.forEach(patchElementFocus);

    // Focus the last item since focus starts from the first one.
    items[items.length - 1].focus();
    fixture.detectChanges();

    spyOn(items[0], 'focus').and.callThrough();

    const event = createKeyboardEvent('keydown', HOME, undefined, { alt: true });

    dispatchEvent(panel, event);
    fixture.detectChanges();

    expect(items[0].focus).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
    flush();
  }));

  it('should focus the last item when pressing end', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;
    const items = Array.from(panel.querySelectorAll('.sbb-menu-item')) as HTMLElement[];
    items.forEach(patchElementFocus);

    spyOn(items[items.length - 1], 'focus').and.callThrough();

    const event = dispatchKeyboardEvent(panel, 'keydown', END);
    fixture.detectChanges();

    expect(items[items.length - 1].focus).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
    flush();
  }));

  it('should not focus the last item when pressing end with a modifier key', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;
    const items = Array.from(panel.querySelectorAll('.sbb-menu-item')) as HTMLElement[];
    items.forEach(patchElementFocus);

    spyOn(items[items.length - 1], 'focus').and.callThrough();

    const event = createKeyboardEvent('keydown', END, undefined, { alt: true });

    dispatchEvent(panel, event);
    fixture.detectChanges();

    expect(items[items.length - 1].focus).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
    flush();
  }));

  it('should respect the DOM order, rather than insertion order, when moving focus using the arrow keys', fakeAsync(() => {
    const fixture = createComponent(SimpleMenuWithRepeater);

    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const menuPanel = document.querySelector('.sbb-menu-panel-wrapper')!;
    let items = menuPanel.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]');

    expect(document.activeElement)
      .withContext('Expected first item to be focused on open')
      .toBe(items[0]);

    // Add a new item after the first one.
    fixture.componentInstance.items.splice(1, 0, { label: 'Calzone', disabled: false });
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    items = menuPanel.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]');
    dispatchKeyboardEvent(menuPanel, 'keydown', DOWN_ARROW);
    fixture.detectChanges();
    tick();

    expect(document.activeElement).withContext('Expected second item to be focused').toBe(items[1]);
    flush();
  }));

  it('should sync the focus order when an item is focused programmatically', fakeAsync(() => {
    const fixture = createComponent(SimpleMenuWithRepeater);

    // Add some more items to work with.
    for (let i = 0; i < 5; i++) {
      fixture.componentInstance.items.push({ label: `Extra ${i}`, disabled: false });
    }

    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const menuPanel = document.querySelector('.sbb-menu-panel-wrapper')!;
    const items = menuPanel.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]');

    expect(document.activeElement)
      .withContext('Expected first item to be focused on open')
      .toBe(items[0]);

    fixture.componentInstance.itemInstances.toArray()[3].focus();
    fixture.detectChanges();

    expect(document.activeElement).withContext('Expected fourth item to be focused').toBe(items[3]);

    dispatchKeyboardEvent(menuPanel, 'keydown', DOWN_ARROW);
    fixture.detectChanges();
    tick();

    expect(document.activeElement).withContext('Expected fifth item to be focused').toBe(items[4]);
    flush();
  }));

  it('should open submenus when the menu is inside an OnPush component', fakeAsync(() => {
    const fixture = createComponent(LazyMenuWithOnPush);
    fixture.detectChanges();

    // Open the top-level menu
    fixture.componentInstance.rootTrigger.nativeElement.click();
    fixture.detectChanges();
    flush();

    // Dispatch a `mouseenter` on the menu item to open the submenu.
    // This will only work if the top-level menu is aware the this menu item exists.
    dispatchMouseEvent(fixture.componentInstance.menuItemWithSubmenu.nativeElement, 'mouseenter');
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('.sbb-menu-item').length)
      .withContext('Expected two open menus')
      .toBe(2);
  }));

  it('should focus the menu panel if all items are disabled', fakeAsync(() => {
    const fixture = createComponent(SimpleMenuWithRepeater, [], [FakeIcon]);
    fixture.componentInstance.items.forEach((item) => (item.disabled = true));
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(
      overlayContainerElement.querySelector('.sbb-menu-panel-wrapper'),
    );
  }));

  it('should focus the menu panel if all items are disabled inside lazy content', fakeAsync(() => {
    const fixture = createComponent(SimpleMenuWithRepeaterInLazyContent, [], [FakeIcon]);
    fixture.componentInstance.items.forEach((item) => (item.disabled = true));
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(
      overlayContainerElement.querySelector('.sbb-menu-panel-wrapper'),
    );
  }));

  it('should clear the static aria-label from the menu host', fakeAsync(() => {
    const fixture = createComponent(StaticAriaLabelMenu);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('sbb-menu').hasAttribute('aria-label')).toBe(false);
  }));

  it('should clear the static aria-labelledby from the menu host', fakeAsync(() => {
    const fixture = createComponent(StaticAriaLabelledByMenu);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('sbb-menu').hasAttribute('aria-labelledby')).toBe(
      false,
    );
  }));

  it('should clear the static aria-describedby from the menu host', fakeAsync(() => {
    const fixture = createComponent(StaticAriaDescribedbyMenu);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('sbb-menu').hasAttribute('aria-describedby')).toBe(
      false,
    );
  }));

  it('should be able to move focus inside the `open` event', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.menuOpened.subscribe(() => {
      (
        document.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]')[3] as HTMLElement
      ).focus();
    });
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const items = document.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]');
    expect(document.activeElement).withContext('Expected fourth item to be focused').toBe(items[3]);
  }));

  it('should default to the "below" and "after" positions', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);
    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

    expect(panel.classList).toContain('sbb-menu-panel-below');
    expect(panel.classList).toContain('sbb-menu-panel-after');
  }));

  it('should keep the panel in the viewport when more items are added while open', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;
    triggerEl.style.position = 'absolute';
    triggerEl.style.left = '200px';
    triggerEl.style.bottom = '300px';
    triggerEl.click();
    fixture.detectChanges();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;
    const viewportHeight = viewportRuler.getViewportSize().height;
    let panelRect = panel.getBoundingClientRect();
    expect(Math.floor(panelRect.bottom)).toBeLessThan(viewportHeight);

    fixture.componentInstance.extraItems = new Array(50).fill('Hello there');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    panelRect = panel.getBoundingClientRect();
    expect(Math.floor(panelRect.bottom)).toBe(viewportHeight);
  });

  describe('lazy rendering', () => {
    it('should be able to render the menu content lazily', fakeAsync(() => {
      const fixture = createComponent(SimpleLazyMenu);

      fixture.detectChanges();
      fixture.componentInstance.triggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper')!;

      expect(panel).withContext('Expected panel to be defined').toBeTruthy();
      expect(panel.textContent)
        .withContext('Expected panel to have correct content')
        .toContain('Another item');
      expect(fixture.componentInstance.trigger.menuOpen)
        .withContext('Expected menu to be open')
        .toBe(true);
    }));

    it('should detach the lazy content when the menu is closed', fakeAsync(() => {
      const fixture = createComponent(SimpleLazyMenu);

      fixture.detectChanges();
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(fixture.componentInstance.items.length).toBeGreaterThan(0);

      fixture.componentInstance.trigger.closeMenu();
      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();

      expect(fixture.componentInstance.items.length).toBe(0);
    }));

    it('should wait for the close animation to finish before considering the panel as closed', fakeAsync(() => {
      const fixture = createComponent(SimpleLazyMenu);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.trigger;

      expect(trigger.menuOpen).withContext('Expected menu to start off closed').toBe(false);

      trigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(trigger.menuOpen).withContext('Expected menu to be open').toBe(true);

      trigger.closeMenu();
      fixture.detectChanges();

      expect(trigger.menuOpen)
        .withContext('Expected menu to be considered open while the close animation is running')
        .toBe(true);
      tick(500);
      fixture.detectChanges();

      expect(trigger.menuOpen).withContext('Expected menu to be closed').toBe(false);
    }));

    it('should focus the first menu item when opening a lazy menu via keyboard', async () => {
      const fixture = createComponent(SimpleLazyMenu);
      fixture.autoDetectChanges();

      // A click without a mousedown before it is considered a keyboard open.
      fixture.componentInstance.triggerEl.nativeElement.click();
      await fixture.whenStable();

      const item = document.querySelector('.sbb-menu-panel-wrapper [sbb-menu-item]')!;

      expect(document.activeElement).withContext('Expected first item to be focused').toBe(item);
    });

    it('should be able to open the same menu with a different context', fakeAsync(() => {
      const fixture = createComponent(LazyMenuWithContext);

      fixture.detectChanges();
      fixture.componentInstance.triggerOne.openMenu();
      fixture.detectChanges();
      tick(500);

      let item = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper [sbb-menu-item]')!;

      expect(item.textContent!.trim()).toBe('one');

      fixture.componentInstance.triggerOne.closeMenu();
      fixture.detectChanges();
      tick(500);

      fixture.componentInstance.triggerTwo.openMenu();
      fixture.detectChanges();
      tick(500);
      item = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper [sbb-menu-item]')!;

      expect(item.textContent!.trim()).toBe('two');
    }));
  });

  describe('positions', () => {
    let fixture: ComponentFixture<PositionedMenu>;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(PositionedMenu);
      fixture.detectChanges();

      trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the bottom edge of viewport,so it has space to open "above"
      trigger.style.position = 'fixed';
      trigger.style.top = '600px';

      // Push trigger to the right, so it has space to open "before"
      trigger.style.left = '100px';
    }));

    it('should append sbb-menu-before if the x position is changed', fakeAsync(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

      expect(panel.classList).toContain('sbb-menu-panel-before');
      expect(panel.classList).not.toContain('sbb-menu-panel-after');

      fixture.componentInstance.xPosition = 'after';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(panel.classList).toContain('sbb-menu-panel-after');
      expect(panel.classList).not.toContain('sbb-menu-panel-before');
    }));

    it('should append sbb-menu-panel-above if the y position is changed', fakeAsync(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

      expect(panel.classList).toContain('sbb-menu-panel-above');
      expect(panel.classList).not.toContain('sbb-menu-panel-below');

      fixture.componentInstance.yPosition = 'below';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(panel.classList).toContain('sbb-menu-panel-below');
      expect(panel.classList).not.toContain('sbb-menu-panel-above');
    }));

    it('should update panel classes if position is changed after reopening', async () => {
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

      expect(panel.classList).toContain('sbb-menu-panel-above');
      expect(panel.classList).toContain('sbb-menu-panel-before');
      expect(panel.classList).not.toContain('sbb-menu-panel-below');
      expect(panel.classList).not.toContain('sbb-menu-panel-after');

      fixture.componentInstance.trigger.closeMenu();
      fixture.detectChanges();
      await fixture.whenStable();

      trigger.style.top = '0';
      fixture.componentInstance.yPosition = 'below';
      fixture.componentInstance.xPosition = 'after';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      fixture.componentInstance.trigger.openMenu();

      fixture.detectChanges();
      await fixture.whenStable();

      const panelBelow = overlayContainerElement.querySelector(
        '.sbb-menu-panel-wrapper',
      ) as HTMLElement;

      expect(panelBelow.classList).not.toContain('sbb-menu-panel-above');
      expect(panelBelow.classList).not.toContain('sbb-menu-panel-before');
      expect(panelBelow.classList).toContain('sbb-menu-panel-below');
      expect(panelBelow.classList).toContain('sbb-menu-panel-after');
    });

    it('should update the position classes if the window is resized', fakeAsync(() => {
      trigger.style.position = 'fixed';
      trigger.style.top = '300px';
      fixture.componentInstance.yPosition = 'above';
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

      expect(panel.classList).toContain('sbb-menu-panel-above');
      expect(panel.classList).not.toContain('sbb-menu-panel-below');

      trigger.style.top = '0';
      dispatchFakeEvent(window, 'resize');
      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();

      expect(panel.classList).not.toContain('sbb-menu-panel-above');
      expect(panel.classList).toContain('sbb-menu-panel-below');
    }));

    it('should be able to update the position after the first open', fakeAsync(() => {
      trigger.style.position = 'fixed';
      trigger.style.top = '200px';

      fixture.componentInstance.yPosition = 'above';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);

      let panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

      expect(Math.floor(panel.getBoundingClientRect().bottom))
        .withContext('Expected menu to open above')
        .toBeCloseTo(Math.floor(trigger.getBoundingClientRect().top), '-1');

      fixture.componentInstance.trigger.closeMenu();
      fixture.detectChanges();
      tick(500);

      fixture.componentInstance.yPosition = 'below';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);
      panel = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

      expect(Math.floor(panel.getBoundingClientRect().top))
        .withContext('Expected menu to open below')
        .toBe(Math.floor(trigger.getBoundingClientRect().top));
    }));

    it('should not throw if a menu reposition is requested while the menu is closed', fakeAsync(() => {
      expect(() => fixture.componentInstance.trigger.updatePosition()).not.toThrow();
    }));
  });

  describe('fallback positions', () => {
    it('should fall back to "before" mode if "after" mode would not fit on screen', fakeAsync(() => {
      const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the right side of viewport, so it doesn't have space to open
      // in its default "after" position on the right side.
      trigger.style.position = 'fixed';
      trigger.style.right = '0';
      trigger.style.top = '200px';

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      // In "before" position, the right sides of the overlay and the origin are aligned.
      // To find the overlay left, subtract the menu width from the origin's right side.
      const expectedLeft = triggerRect.right - overlayRect.width;
      expect(Math.floor(overlayRect.left))
        .withContext(
          `Expected menu to open in "before" position if "after" position ` + `wouldn't fit.`,
        )
        .toBe(Math.floor(expectedLeft));

      // The y-position of the overlay should be unaffected, as it can already fit vertically
      expect(Math.floor(overlayRect.top))
        .withContext(`Expected menu top position to be unchanged if it can fit in the viewport.`)
        .toBe(Math.floor(triggerRect.top));
    }));

    it('should fall back to "above" mode if "below" mode would not fit on screen', fakeAsync(() => {
      const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the bottom part of viewport, so it doesn't have space to open
      // in its default "below" position below the trigger.
      trigger.style.position = 'fixed';
      trigger.style.bottom = '65px';

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      expect(Math.floor(overlayRect.bottom))
        .withContext(`Expected menu to open in "above" position if "below" position wouldn't fit.`)
        .toBe(Math.floor(triggerRect.bottom));

      // The x-position of the overlay should be unaffected, as it can already fit horizontally
      expect(Math.floor(overlayRect.left))
        .withContext(`Expected menu x position to be unchanged if it can fit in the viewport.`)
        .toBe(Math.floor(triggerRect.left));
    }));

    it('should re-position menu on both axes if both defaults would not fit', fakeAsync(() => {
      const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      // push trigger to the bottom, right part of viewport, so it doesn't have space to open
      // in its default "after below" position.
      trigger.style.position = 'fixed';
      trigger.style.right = '0';
      trigger.style.bottom = '0';

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      const expectedLeft = triggerRect.right - overlayRect.width;

      expect(Math.floor(overlayRect.left))
        .withContext(`Expected menu to open in "before" position if "after" position wouldn't fit.`)
        .toBe(Math.floor(expectedLeft));

      expect(Math.floor(overlayRect.bottom))
        .withContext(`Expected menu to open in "above" position if "below" position wouldn't fit.`)
        .toBe(Math.floor(triggerRect.bottom));
    }));

    it('should re-position a menu with custom position set', fakeAsync(() => {
      const fixture = createComponent(PositionedMenu);
      fixture.componentInstance.marginleft = 0;
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      // As designated "before" position won't fit on screen, the menu should fall back
      // to "after" mode, where the left sides of the overlay and trigger are aligned.
      expect(Math.floor(overlayRect.left))
        .withContext(`Expected menu to open in "after" position if "before" position wouldn't fit.`)
        .toBe(Math.floor(triggerRect.left));

      // As designated "above" position won't fit on screen, the menu should fall back
      // to "below" mode, where the top edges of the overlay and trigger are aligned.
      expect(Math.floor(overlayRect.top))
        .withContext(`Expected menu to open in "below" position if "above" position wouldn't fit.`)
        .toBe(Math.floor(triggerRect.top));
    }));

    function getOverlayPane(): HTMLElement {
      return overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    }
  });

  describe('overlapping trigger', () => {
    /**
     * This test class is used to create components containing a menu.
     * It provides helpers to reposition the trigger, open the menu,
     * and access the trigger and overlay positions.
     * Additionally it can take any inputs for the menu wrapper component.
     *
     * Basic usage:
     * const subject = new OverlapSubject(MyComponent);
     * subject.openMenu();
     */
    class OverlapSubject<T extends TestableMenu> {
      readonly fixture: ComponentFixture<T>;
      readonly trigger: HTMLElement;

      constructor(ctor: new () => T, inputs: { [key: string]: any } = {}) {
        this.fixture = createComponent(ctor);
        Object.keys(inputs).forEach(
          (key) => ((this.fixture.componentInstance as any)[key] = inputs[key]),
        );
        this.fixture.detectChanges();
        this.trigger = this.fixture.componentInstance.triggerEl.nativeElement;
      }

      openMenu() {
        this.fixture.componentInstance.trigger.openMenu();
        this.fixture.detectChanges();
        tick(500);
      }

      get overlayRect() {
        return this._getOverlayPane().getBoundingClientRect();
      }

      get triggerRect() {
        return this.trigger.getBoundingClientRect();
      }

      get menuPanel() {
        return overlayContainerElement.querySelector('.sbb-menu-panel-wrapper');
      }

      private _getOverlayPane() {
        return overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      }
    }

    let subject: OverlapSubject<OverlapMenu>;
    describe('explicitly overlapping', () => {
      beforeEach(fakeAsync(() => {
        subject = new OverlapSubject(OverlapMenu, { overlapTrigger: true });
      }));

      it('positions the overlay below the trigger', fakeAsync(() => {
        subject.openMenu();

        // Since the menu is overlaying the trigger, the overlay top should be the trigger top.
        expect(Math.floor(subject.overlayRect.top))
          .withContext(`Expected menu to open in default "below" position.`)
          .toBe(Math.floor(subject.triggerRect.top));
      }));
    });

    describe('not overlapping', () => {
      beforeEach(fakeAsync(() => {
        subject = new OverlapSubject(OverlapMenu, { overlapTrigger: false });
      }));

      it('positions the overlay below the trigger', fakeAsync(() => {
        subject.openMenu();

        // Since the menu is below the trigger, the overlay top should be the trigger bottom.
        expect(Math.floor(subject.overlayRect.top))
          .withContext(`Expected menu to open directly below the trigger.`)
          .toBe(Math.floor(subject.triggerRect.bottom));
      }));

      it('supports above position fall back', fakeAsync(() => {
        // Push trigger to the bottom part of viewport, so it doesn't have space to open
        // in its default "below" position below the trigger.
        subject.trigger.style.position = 'fixed';
        subject.trigger.style.bottom = '0';
        subject.openMenu();

        // Since the menu is above the trigger, the overlay bottom should be the trigger top.
        expect(Math.floor(subject.overlayRect.bottom))
          .withContext(
            `Expected menu to open in "above" position if "below" position ` + `wouldn't fit.`,
          )
          .toBe(Math.floor(subject.triggerRect.top));
      }));

      it('repositions the origin to be below, so the menu opens from the trigger', fakeAsync(() => {
        subject.openMenu();
        subject.fixture.detectChanges();

        expect(subject.menuPanel!.classList).toContain('sbb-menu-panel-below');
        expect(subject.menuPanel!.classList).not.toContain('sbb-menu-panel-above');
      }));
    });
  });

  describe('close event', () => {
    let fixture: ComponentFixture<SimpleMenu>;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleMenu, [], [FakeIcon]);
      fixture.detectChanges();
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      tick(500);
    }));

    it('should emit an event when a menu item is clicked', fakeAsync(() => {
      const menuItem = overlayContainerElement.querySelector('[sbb-menu-item]') as HTMLElement;

      menuItem.click();
      fixture.detectChanges();
      tick(500);

      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith('click');
      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(1);
    }));

    it('should emit a close event when the backdrop is clicked', fakeAsync(() => {
      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop',
      ) as HTMLElement;

      backdrop.click();
      fixture.detectChanges();
      tick(500);

      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith(undefined);
      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(1);
    }));

    it('should emit an event when pressing ESCAPE', fakeAsync(() => {
      const menu = overlayContainerElement.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

      dispatchKeyboardEvent(menu, 'keydown', ESCAPE);
      fixture.detectChanges();
      tick(500);

      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith('keydown');
      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(1);
    }));

    it('should complete the callback when the menu is destroyed', fakeAsync(() => {
      const emitCallback = jasmine.createSpy('emit callback');
      const completeCallback = jasmine.createSpy('complete callback');

      fixture.componentInstance.menu.closed.subscribe(emitCallback, null, completeCallback);
      fixture.destroy();
      tick(500);

      expect(emitCallback).toHaveBeenCalledWith(undefined);
      expect(emitCallback).toHaveBeenCalledTimes(1);
      expect(completeCallback).toHaveBeenCalled();
    }));
  });

  describe('nested menu', () => {
    let fixture: ComponentFixture<NestedMenu>;
    let instance: NestedMenu;
    let overlay: HTMLElement;
    const compileTestComponent = () => {
      fixture = createComponent(NestedMenu);

      fixture.detectChanges();
      instance = fixture.componentInstance;
      overlay = overlayContainerElement;
    };

    it('should set the `triggersSubmenu` flags on the triggers', fakeAsync(() => {
      compileTestComponent();
      expect(instance.rootTrigger.triggersSubmenu()).toBe(false);
      expect(instance.levelOneTrigger.triggersSubmenu()).toBe(true);
      expect(instance.levelTwoTrigger.triggersSubmenu()).toBe(true);
    }));

    it('should set the `parentMenu` on the sub-menu instances', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(instance.rootMenu.parentMenu).toBeFalsy();
      expect(instance.levelOneMenu.parentMenu).toBe(instance.rootMenu);
      expect(instance.levelTwoMenu.parentMenu).toBe(instance.levelOneMenu);
    }));

    it('should emit an event when the hover state of the menu items changes', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const spy = jasmine.createSpy('hover spy');
      const subscription = instance.rootMenu._hovered().subscribe(spy);
      const menuItems = overlay.querySelectorAll('[sbb-menu-item]');

      dispatchMouseEvent(menuItems[0], 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(spy).toHaveBeenCalledTimes(1);

      dispatchMouseEvent(menuItems[1], 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(spy).toHaveBeenCalledTimes(2);

      subscription.unsubscribe();
    }));

    it('should toggle a nested menu when its trigger is hovered', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);

      const items = Array.from(overlay.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]'));
      const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

      dispatchMouseEvent(levelOneTrigger, 'mouseenter');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(levelOneTrigger.classList)
        .withContext('Expected the trigger to be highlighted')
        .toContain('sbb-active');
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);

      dispatchMouseEvent(items[items.indexOf(levelOneTrigger) + 1], 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);
      expect(levelOneTrigger.classList).not.toContain(
        'sbb-active',
        'Expected the trigger to not be highlighted',
      );
    }));

    it('should close all the open sub-menus when the hover state is changed at the root', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      const items = Array.from(overlay.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]'));
      const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

      dispatchMouseEvent(levelOneTrigger, 'mouseenter');
      fixture.detectChanges();
      tick();

      const levelTwoTrigger = overlay.querySelector('#level-two-trigger')! as HTMLElement;
      dispatchMouseEvent(levelTwoTrigger, 'mouseenter');
      fixture.detectChanges();
      tick();

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected three open menus')
        .toBe(3);

      dispatchMouseEvent(items[items.indexOf(levelOneTrigger) + 1], 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);
    }));

    it('should close submenu when hovering over disabled sibling item', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      const items = fixture.debugElement.queryAll(By.directive(SbbMenuItem));

      dispatchFakeEvent(items[0].nativeElement, 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);

      items[1].componentInstance.disabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      // Invoke the handler directly since the fake events are flaky on disabled elements.
      items[1].componentInstance._handleMouseEnter();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);
    }));

    it('should not open submenu when hovering over disabled trigger', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);

      const item = fixture.debugElement.query(By.directive(SbbMenuItem))!;

      item.componentInstance.disabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      // Invoke the handler directly since the fake events are flaky on disabled elements.
      item.componentInstance._handleMouseEnter();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected to remain at one open menu')
        .toBe(1);
    }));

    it('should open a nested menu when its trigger is clicked', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);

      const levelOneTrigger = overlay.querySelector('#level-one-trigger')! as HTMLElement;

      levelOneTrigger.click();
      fixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);

      levelOneTrigger.click();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected repeat clicks not to close the menu.')
        .toBe(2);
    }));

    it('should open and close a nested menu with arrow keys in ltr', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);

      const levelOneTrigger = overlay.querySelector('#level-one-trigger')! as HTMLElement;

      dispatchKeyboardEvent(levelOneTrigger, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const panels = overlay.querySelectorAll('.sbb-menu-panel-wrapper');

      expect(panels.length).withContext('Expected two open menus').toBe(2);
      dispatchKeyboardEvent(panels[1], 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length).toBe(1);
    }));

    it('should not do anything with the arrow keys for a top-level menu', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      const menu = overlay.querySelector('.sbb-menu-panel-wrapper')!;

      dispatchKeyboardEvent(menu, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one menu to remain open')
        .toBe(1);

      dispatchKeyboardEvent(menu, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one menu to remain open')
        .toBe(1);
    }));

    it('should close all of the menus when the backdrop is clicked', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected three open menus')
        .toBe(3);
      expect(overlay.querySelectorAll('.cdk-overlay-backdrop').length)
        .withContext('Expected one backdrop element')
        .toBe(1);
      expect(
        overlay.querySelectorAll('.sbb-menu-panel-wrapper, .cdk-overlay-backdrop')[0].classList,
      )
        .withContext('Expected backdrop to be beneath all of the menus')
        .toContain('cdk-overlay-backdrop');

      (overlay.querySelector('.cdk-overlay-backdrop')! as HTMLElement).click();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected no open menus')
        .toBe(0);
    }));

    it('should shift focus between the sub-menus', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelector('.sbb-menu-panel-wrapper')!.contains(document.activeElement))
        .withContext('Expected focus to be inside the root menu')
        .toBe(true);

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(
        overlay.querySelectorAll('.sbb-menu-panel-wrapper')[1].contains(document.activeElement),
      )
        .withContext('Expected focus to be inside the first nested menu')
        .toBe(true);

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(
        overlay.querySelectorAll('.sbb-menu-panel-wrapper')[2].contains(document.activeElement),
      )
        .withContext('Expected focus to be inside the second nested menu')
        .toBe(true);

      instance.levelTwoTrigger.closeMenu();
      fixture.detectChanges();
      tick(500);

      expect(
        overlay.querySelectorAll('.sbb-menu-panel-wrapper')[1].contains(document.activeElement),
      )
        .withContext('Expected focus to be back inside the first nested menu')
        .toBe(true);

      instance.levelOneTrigger.closeMenu();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelector('.sbb-menu-panel-wrapper')!.contains(document.activeElement))
        .withContext('Expected focus to be back inside the root menu')
        .toBe(true);
    }));

    it('should restore focus to a nested trigger when navgating via the keyboard', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      const levelOneTrigger = overlay.querySelector('#level-one-trigger')! as HTMLElement;
      dispatchKeyboardEvent(levelOneTrigger, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const spy = spyOn(levelOneTrigger, 'focus').and.callThrough();
      dispatchKeyboardEvent(
        overlay.querySelectorAll('.sbb-menu-panel-wrapper')[1],
        'keydown',
        LEFT_ARROW,
      );
      fixture.detectChanges();
      tick(500);

      expect(spy).toHaveBeenCalled();
    }));

    it('should position the sub-menu to the right edge of the trigger in ltr', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.style.position = 'fixed';
      instance.rootTriggerEl.nativeElement.style.left = '50px';
      instance.rootTriggerEl.nativeElement.style.top = '50px';
      instance.rootTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const triggerRect = overlay.querySelector('#level-one-trigger')!.getBoundingClientRect();
      const panelRect = overlay.querySelectorAll('.cdk-overlay-pane')[1].getBoundingClientRect();

      // Subtract 3px space
      expect(Math.round(triggerRect.right) - 3).toBe(Math.round(panelRect.left));
      expect(Math.round(triggerRect.top)).toBe(Math.round(panelRect.top));
    }));

    it('should fall back to aligning to the left edge of the trigger in ltr', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.style.position = 'fixed';
      instance.rootTriggerEl.nativeElement.style.right = '10px';
      instance.rootTriggerEl.nativeElement.style.top = '50%';
      instance.rootTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const triggerRect = overlay.querySelector('#level-one-trigger')!.getBoundingClientRect();
      const panelRect = overlay.querySelectorAll('.cdk-overlay-pane')[1].getBoundingClientRect();

      // Add 3px space
      expect(Math.round(triggerRect.left) + 3).toBe(Math.round(panelRect.right));
      expect(Math.round(triggerRect.top)).toBe(Math.round(panelRect.top));
    }));

    it('should close all of the menus when an item is clicked', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      const menus = overlay.querySelectorAll('.sbb-menu-panel-wrapper');

      expect(menus.length).withContext('Expected three open menus').toBe(3);

      (menus[2].querySelector('.sbb-menu-item')! as HTMLElement).click();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected no open menus')
        .toBe(0);
    }));

    it('should close all of the menus when the user tabs away', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      const menus = overlay.querySelectorAll('.sbb-menu-panel-wrapper');

      expect(menus.length).withContext('Expected three open menus').toBe(3);

      dispatchKeyboardEvent(menus[menus.length - 1], 'keydown', TAB);
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected no open menus')
        .toBe(0);
    }));

    it('should set a class on the menu items that trigger a sub-menu', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const menuItems = overlay.querySelectorAll('[sbb-menu-item]');

      expect(menuItems[0].classList).toContain('sbb-menu-item-submenu-trigger');
      expect(menuItems[1].classList).not.toContain('sbb-menu-item-submenu-trigger');
    }));

    it('should increase the sub-menu elevation based on its depth', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const menus = overlay.querySelectorAll('.sbb-menu-panel-wrapper');

      expect(menus[0].classList)
        .withContext('Expected root menu to have base elevation.')
        .toContain('sbb-elevation-z4');
      expect(menus[1].classList)
        .withContext('Expected first sub-menu to have base elevation + 1.')
        .toContain('sbb-elevation-z5');
      expect(menus[2].classList)
        .withContext('Expected second sub-menu to have base elevation + 2.')
        .toContain('sbb-elevation-z6');
    }));

    it('should update the elevation when the same menu is opened at a different depth', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      let lastMenu = overlay.querySelectorAll('.sbb-menu-panel-wrapper')[2];

      expect(lastMenu.classList)
        .withContext('Expected menu to have the base elevation plus two.')
        .toContain('sbb-elevation-z6');

      (overlay.querySelector('.cdk-overlay-backdrop')! as HTMLElement).click();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected no open menus')
        .toBe(0);

      instance.alternateTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      lastMenu = overlay.querySelector('.sbb-menu-panel-wrapper') as HTMLElement;

      expect(lastMenu.classList)
        .not.withContext('Expected menu not to maintain old elevation.')
        .toContain('sbb-elevation-z6');
      expect(lastMenu.classList)
        .withContext('Expected menu to have the proper updated elevation.')
        .toContain('sbb-elevation-z4');
    }));

    it('should not change focus origin if origin not specified for trigger', fakeAsync(() => {
      compileTestComponent();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();
      tick(500);
      instance.levelOneTrigger.focus('mouse');
      fixture.detectChanges();

      instance.levelTwoTrigger.focus();
      fixture.detectChanges();
      tick(500);

      const levelTwoTrigger = overlay.querySelector('#level-two-trigger')! as HTMLElement;

      expect(levelTwoTrigger.classList).toContain('cdk-focused');
      expect(levelTwoTrigger.classList).toContain('cdk-mouse-focused');
    }));

    it('should not increase the elevation if the user specified a custom one', fakeAsync(() => {
      const elevationFixture = createComponent(NestedMenuCustomElevation);

      elevationFixture.detectChanges();
      elevationFixture.componentInstance.rootTrigger.openMenu();
      elevationFixture.detectChanges();
      tick(500);

      elevationFixture.componentInstance.levelOneTrigger.openMenu();
      elevationFixture.detectChanges();
      tick(500);

      const menuClasses =
        overlayContainerElement.querySelectorAll('.sbb-menu-panel-wrapper')[1].classList;

      expect(menuClasses)
        .withContext('Expected user elevation to be maintained')
        .toContain('sbb-elevation-z24');
      expect(menuClasses)
        .not.withContext('Expected no stacked elevation.')
        .toContain('sbb-elevation-z3');
    }));

    it('should close all of the menus when the root is closed programmatically', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      const menus = overlay.querySelectorAll('.sbb-menu-panel-wrapper');

      expect(menus.length).withContext('Expected three open menus').toBe(3);

      instance.rootTrigger.closeMenu();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected no open menus')
        .toBe(0);
    }));

    it('should toggle a nested menu when its trigger is added after init', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);

      instance.showLazy = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const lazyTrigger = overlay.querySelector('#lazy-trigger')!;

      dispatchMouseEvent(lazyTrigger, 'mouseenter');
      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();
      flush();

      expect(lazyTrigger.classList)
        .withContext('Expected the trigger to be highlighted')
        .toContain('sbb-active');
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);
    }));

    it('should prevent the default mousedown action if the menu item opens a sub-menu', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      const event = createMouseEvent('mousedown');
      Object.defineProperty(event, 'buttons', { get: () => 1 });
      event.preventDefault = jasmine.createSpy('preventDefault spy');

      dispatchEvent(overlay.querySelector('[sbb-menu-item]')!, event);
      fixture.detectChanges();
      tick(500);

      expect(event.preventDefault).toHaveBeenCalled();
    }));

    it('should handle the items being rendered in a repeater', fakeAsync(() => {
      const repeaterFixture = createComponent(NestedMenuRepeater);
      overlay = overlayContainerElement;

      expect(() => repeaterFixture.detectChanges()).not.toThrow();

      repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);

      dispatchMouseEvent(overlay.querySelector('.level-one-trigger')!, 'mouseenter');
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);
    }));

    it('should be able to trigger the same nested menu from different triggers', fakeAsync(() => {
      const repeaterFixture = createComponent(NestedMenuRepeater);
      overlay = overlayContainerElement;

      repeaterFixture.detectChanges();
      repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);

      const triggers = overlay.querySelectorAll('.level-one-trigger');

      dispatchMouseEvent(triggers[0], 'mouseenter');
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);

      dispatchMouseEvent(triggers[1], 'mouseenter');
      repeaterFixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);
    }));

    it('should close the initial menu if the user moves away while animating', fakeAsync(() => {
      const repeaterFixture = createComponent(NestedMenuRepeater);
      overlay = overlayContainerElement;

      repeaterFixture.detectChanges();
      repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected one open menu')
        .toBe(1);

      const triggers = overlay.querySelectorAll('.level-one-trigger');

      dispatchMouseEvent(triggers[0], 'mouseenter');
      repeaterFixture.detectChanges();
      tick(100);
      dispatchMouseEvent(triggers[1], 'mouseenter');
      repeaterFixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);
    }));

    it(
      'should be able to open a submenu through an item that is not a direct descendant ' +
        'of the panel',
      fakeAsync(() => {
        const nestedFixture = createComponent(SubmenuDeclaredInsideParentMenu);
        overlay = overlayContainerElement;

        nestedFixture.detectChanges();
        nestedFixture.componentInstance.rootTriggerEl.nativeElement.click();
        nestedFixture.detectChanges();
        tick(500);
        expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
          .withContext('Expected one open menu')
          .toBe(1);

        dispatchMouseEvent(overlay.querySelector('.level-one-trigger')!, 'mouseenter');
        nestedFixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
          .withContext('Expected two open menus')
          .toBe(2);
      }),
    );

    it(
      'should not close when hovering over a menu item inside a sub-menu panel that is declared' +
        'inside the root menu',
      fakeAsync(() => {
        const nestedFixture = createComponent(SubmenuDeclaredInsideParentMenu);
        overlay = overlayContainerElement;

        nestedFixture.detectChanges();
        nestedFixture.componentInstance.rootTriggerEl.nativeElement.click();
        nestedFixture.detectChanges();
        tick(500);
        expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
          .withContext('Expected one open menu')
          .toBe(1);

        dispatchMouseEvent(overlay.querySelector('.level-one-trigger')!, 'mouseenter');
        nestedFixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
          .withContext('Expected two open menus')
          .toBe(2);

        dispatchMouseEvent(overlay.querySelector('.level-two-item')!, 'mouseenter');
        nestedFixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
          .withContext('Expected two open menus to remain')
          .toBe(2);
      }),
    );

    it('should not re-focus a child menu trigger when hovering another trigger', fakeAsync(() => {
      compileTestComponent();

      dispatchFakeEvent(instance.rootTriggerEl.nativeElement, 'mousedown');
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      const items = Array.from(overlay.querySelectorAll('.sbb-menu-panel-wrapper [sbb-menu-item]'));
      const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

      dispatchMouseEvent(levelOneTrigger, 'mouseenter');
      tick();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel-wrapper').length)
        .withContext('Expected two open menus')
        .toBe(2);

      dispatchMouseEvent(items[items.indexOf(levelOneTrigger) + 1], 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(document.activeElement).not.toBe(
        levelOneTrigger,
        'Expected focus not to be returned to the initial trigger.',
      );
    }));

    it('should only apply sbb-menu-panel-root css class to panel root', () => {
      compileTestComponent();

      fixture.componentInstance.rootTrigger.openMenu();
      fixture.detectChanges();

      fixture.componentInstance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      const panels = fixture.debugElement.queryAll(By.css('.sbb-menu-panel'));
      expect(panels.length).withContext('Expected to have 2 panels open').toBe(2);

      expect(
        fixture.debugElement.queryAll(By.css('.sbb-menu-panel.sbb-menu-panel-root')).length,
      ).toBe(1, 'Expected to to find sbb-menu-panel-root class only once');

      expect(panels[0].nativeElement.classList.contains('sbb-menu-panel-root')).toBeTrue();
    });

    it('should only apply sbb-menu-trigger-root css class to root trigger', () => {
      compileTestComponent();

      fixture.componentInstance.rootTrigger.openMenu();
      fixture.detectChanges();

      fixture.componentInstance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      const triggers = fixture.debugElement.queryAll(By.css('.sbb-menu-trigger'));
      expect(triggers.length).withContext('Expected to have 4 triggers found').toBe(4);
      expect(
        fixture.debugElement.queryAll(By.css('.sbb-menu-trigger.sbb-menu-trigger-root')).length,
      ).toBe(
        2,
        'Expected to to find sbb-menu-trigger-root class twice (root trigger and alternative root trigger)',
      );

      expect(triggers[0].nativeElement.classList.contains('sbb-menu-trigger-root')).toBeTrue();
    });
  });
});

describe('SbbMenu default overrides', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbMenuModule, NoopAnimationsModule, SbbIconModule, SbbIconTestingModule],
      declarations: [SimpleMenu, FakeIcon],
      providers: [
        {
          provide: SBB_MENU_DEFAULT_OPTIONS,
          useValue: { overlapTrigger: true, xPosition: 'before', yPosition: 'above' },
        },
      ],
    });
  }));

  it('should allow for the default menu options to be overridden', fakeAsync(() => {
    const fixture = TestBed.createComponent(SimpleMenu);
    fixture.detectChanges();
    const menu = fixture.componentInstance.menu;

    expect(menu.overlapTrigger).toBe(true);
    expect(menu.xPosition).toBe('before');
    expect(menu.yPosition).toBe('above');
  }));
});

describe('SbbMenu contextmenu', () => {
  let securityBypassSpy: jasmine.Spy;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbMenuModule, NoopAnimationsModule, SbbIconModule, SbbIconTestingModule],
      declarations: [
        ContextmenuStaticTrigger,
        ContextmenuDynamicTrigger,
        ContextmenuOnlyTextTrigger,
      ],
    });

    inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
      securityBypassSpy = spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    })();
  }));

  function testTriggerCopy(component: Type<ContextmenuDynamicTrigger | ContextmenuStaticTrigger>) {
    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const panelWrapper = fixture.debugElement.query(
      By.css('.sbb-menu-panel-wrapper'),
    ).nativeElement;

    const copiedTriggerButton = panelWrapper.querySelector('button');

    expect(panelWrapper.children.length).toBe(2);
    expect(copiedTriggerButton.children[0].tagName.toLowerCase()).toBe('sbb-icon');
  }

  it('should copy html from trigger to panel trigger', () => {
    testTriggerCopy(ContextmenuStaticTrigger);
    expect(securityBypassSpy).toHaveBeenCalledTimes(1);
  });

  it('should copy dynamic trigger from trigger to panel trigger', () => {
    testTriggerCopy(ContextmenuDynamicTrigger);
    expect(securityBypassSpy).not.toHaveBeenCalled();
  });

  it('should copy trigger with only text', () => {
    const fixture = TestBed.createComponent(ContextmenuOnlyTextTrigger);
    fixture.detectChanges();

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const panelWrapper = fixture.debugElement.query(
      By.css('.sbb-menu-panel-wrapper'),
    ).nativeElement;

    const copiedTriggerButton = panelWrapper.querySelector('button')!;

    expect(panelWrapper.children.length).toBe(2);
    expect(copiedTriggerButton.innerHTML).toBe(`I'm only a simple text`);
    expect(securityBypassSpy).not.toHaveBeenCalled();
  });

  it('should not set elementContent of triggerContext if templateContent is provided', () => {
    const fixture = TestBed.createComponent(ContextmenuDynamicTrigger);
    fixture.detectChanges();

    const trigger = fixture.componentInstance.trigger;
    trigger.openMenu();

    expect(trigger.menu?.triggerContext.elementContent).toBeUndefined();
  });

  it('should apply sbb-menu-trigger-default css class', () => {
    const fixture = TestBed.createComponent(ContextmenuDynamicTrigger);
    fixture.detectChanges();
    expect(
      fixture.debugElement.nativeElement.querySelector(
        '.sbb-menu-trigger.sbb-menu-trigger-default',
      ),
    ).toBeTruthy();
  });
});

describe('SbbMenu headless trigger', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbMenuModule, NoopAnimationsModule, SbbIconModule, SbbIconTestingModule],
      declarations: [HeadlessTrigger],
    });
  }));

  it('should apply sbb-menu-trigger-headless css class', () => {
    const fixture = TestBed.createComponent(HeadlessTrigger);
    fixture.detectChanges();
    expect(
      fixture.debugElement.nativeElement.querySelector(
        '.sbb-menu-trigger.sbb-menu-trigger-headless',
      ),
    ).toBeTruthy();
  });
});

describe('SbbMenu offset', () => {
  const xOffset = 30;
  const yOffset = 15;
  const sbbMenuInheritedTriggerContext: SbbMenuInheritedTriggerContext = {
    type: 'breadcrumb',
    xPosition: 'after',
    xOffset: xOffset,
    yOffset: yOffset,
  };

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbMenuModule, NoopAnimationsModule, SbbIconModule, SbbIconTestingModule],
      declarations: [ContextmenuOnlyTextTrigger],
      providers: [
        PROVIDE_FAKE_MEDIA_MATCHER,
        { provide: SBB_MENU_INHERITED_TRIGGER_CONTEXT, useValue: sbbMenuInheritedTriggerContext },
      ],
    });
  }));

  afterEach(() => {
    mediaMatcher.clear();
  });

  function assertOffset(expectedXOffset: number, expectedYOffset: number, breakpoint?: string) {
    const fixture = TestBed.createComponent(ContextmenuOnlyTextTrigger);
    fixture.detectChanges();
    if (breakpoint) {
      mediaMatcher.setMatchesQuery(breakpoint, true);
    }
    tick();

    // Open menu
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const overlay = document.body.querySelector('.cdk-overlay-pane');
    expect(overlay!.getBoundingClientRect().left).toBe(expectedXOffset);
    expect(overlay!.getBoundingClientRect().top).toBe(expectedYOffset);

    flush();
  }

  it('should apply offset in desktop view', fakeAsync(() => {
    assertOffset(xOffset, yOffset);
  }));

  it('should apply offset in 4k resolution', fakeAsync(() => {
    assertOffset(xOffset * SCALING_FACTOR_4K, yOffset * SCALING_FACTOR_4K, Breakpoints.Desktop4k);
  }));

  it('should apply offset in 5k resolution', fakeAsync(() => {
    assertOffset(xOffset * SCALING_FACTOR_5K, yOffset * SCALING_FACTOR_5K, Breakpoints.Desktop5k);
  }));

  describe('lean', () => {
    switchToLean();

    it('should not apply scaling factor in lean in 4k resolution', fakeAsync(() => {
      assertOffset(xOffset, yOffset, Breakpoints.Desktop4k);
    }));
  });
});

describe('SbbMenu contextmenu trigger', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbMenuModule, NoopAnimationsModule, SbbIconModule, SbbIconTestingModule],
      declarations: [ContextmenuTrigger, ContextmenuCustomIconTrigger],
    });
  }));

  it('should apply contextmenu classes and use correct icon', () => {
    const fixture = TestBed.createComponent(ContextmenuTrigger);
    fixture.detectChanges();

    expect(
      fixture.debugElement.nativeElement.querySelector(
        '.sbb-menu-trigger.sbb-menu-trigger-contextmenu sbb-icon',
      )!.outerHTML,
    ).toContain('context-menu-small');

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    expect(document.querySelector('.sbb-menu-panel-type-contextmenu')).toBeTruthy();
    expect(
      document.querySelector('.sbb-menu-panel-type-contextmenu sbb-icon')!.outerHTML,
    ).toContain('context-menu-small');
  });

  it('should allow custom icon', () => {
    const fixture = TestBed.createComponent(ContextmenuCustomIconTrigger);
    fixture.detectChanges();

    expect(
      fixture.debugElement.nativeElement.querySelector(
        '.sbb-menu-trigger.sbb-menu-trigger-contextmenu sbb-icon',
      )!.outerHTML,
    ).toContain('other-icon');

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    expect(
      document.querySelector('.sbb-menu-panel-type-contextmenu sbb-icon')!.outerHTML,
    ).toContain('other-icon');
  });
});

const SIMPLE_MENU_TEMPLATE = `
    <button
      [sbbMenuTriggerFor]="menu"
      [sbbMenuTriggerRestoreFocus]="restoreFocus"
      #triggerEl
      type="button"
    >
      Toggle menu
    </button>
    <sbb-menu
      #menu="sbbMenu"
      [class]="panelClass"
      (closed)="closeCallback($event)"
      [backdropClass]="backdropClass"
      [aria-label]="ariaLabel"
      [aria-labelledby]="ariaLabelledby"
      [aria-describedby]="ariaDescribedby"
    >
      <button sbb-menu-item type="button">Item</button>
      <button sbb-menu-item disabled type="button">Disabled</button>
      <button sbb-menu-item type="button">
        <sbb-icon svgIcon="unicorn"></sbb-icon>
        Item with an icon
      </button>
      <button sbb-menu-item type="button">
        <span>Item with text inside span</span>
      </button>
      @for (item of extraItems; track item) {
        <button sbb-menu-item type="button">{{ item }}</button>
      }
    </sbb-menu>
  `;
@Component({
  template: SIMPLE_MENU_TEMPLATE,
})
class SimpleMenu {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
  @ViewChild(SbbMenu) menu: SbbMenu;
  @ViewChildren(SbbMenuItem) items: QueryList<SbbMenuItem>;
  extraItems: string[] = [];
  closeCallback = jasmine.createSpy('menu closed callback');
  backdropClass: string;
  panelClass: string;
  restoreFocus = true;
  ariaLabel: string;
  ariaLabelledby: string;
  ariaDescribedby: string;
}

@Component({ template: SIMPLE_MENU_TEMPLATE, changeDetection: ChangeDetectionStrategy.OnPush })
class SimpleMenuOnPush extends SimpleMenu {}

@Component({
  template: `
    <button
      [sbbMenuTriggerFor]="menu"
      #triggerEl
      [style.marginLeft]="marginleft + 'px'"
      type="button"
    >
      Toggle menu
    </button>
    <sbb-menu [xPosition]="xPosition" [yPosition]="yPosition" #menu="sbbMenu">
      <button sbb-menu-item type="button">Positioned Content</button>
    </sbb-menu>
  `,
})
class PositionedMenu {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
  xPosition: SbbMenuPositionX = 'before';
  yPosition: SbbMenuPositionY = 'above';
  marginleft: number = 300;
}

interface TestableMenu {
  trigger: SbbMenuTrigger;
  triggerEl: ElementRef<HTMLElement>;
}
@Component({
  template: `
    <button [sbbMenuHeadlessTriggerFor]="menu" #triggerEl type="button">Toggle menu</button>
    <sbb-menu [overlapTrigger]="overlapTrigger" #menu="sbbMenu">
      <button sbb-menu-item type="button">Not overlapped Content</button>
    </sbb-menu>
  `,
})
class OverlapMenu implements TestableMenu {
  @Input() overlapTrigger: boolean;
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
}

@Component({
  selector: 'custom-menu',
  template: `
    <ng-template>
      Custom Menu header
      <ng-content></ng-content>
    </ng-template>
  `,
  exportAs: 'sbbCustomMenu',
})
class CustomMenuPanel implements SbbMenuPanel {
  xPosition: SbbMenuPositionX = 'after';
  yPosition: SbbMenuPositionY = 'below';
  overlapTrigger = true;
  parentMenu: SbbMenuPanel;

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @Output() readonly closed = new EventEmitter<void | 'click' | 'keydown' | 'tab'>();
  focusFirstItem = () => {};
  resetActiveItem = () => {};
  setPositionClasses = () => {};

  width: number;
  triggerContext: SbbMenuTriggerContext;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu" type="button">Toggle menu</button>
    <custom-menu #menu="sbbCustomMenu">
      <button sbb-menu-item type="button">Custom Content</button>
    </custom-menu>
  `,
})
class CustomMenu {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="root" #rootTrigger="sbbMenuTrigger" #rootTriggerEl type="button">
      Toggle menu
    </button>

    <button [sbbMenuTriggerFor]="levelTwo" #alternateTrigger="sbbMenuTrigger" type="button">
      Toggle alternate menu
    </button>

    <sbb-menu #root="sbbMenu" (closed)="rootCloseCallback($event)">
      <button
        sbb-menu-item
        id="level-one-trigger"
        [sbbMenuTriggerFor]="levelOne"
        #levelOneTrigger="sbbMenuTrigger"
        type="button"
      >
        One
      </button>
      <button sbb-menu-item type="button">Two</button>
      @if (showLazy) {
        <button
          sbb-menu-item
          id="lazy-trigger"
          [sbbMenuTriggerFor]="lazy"
          #lazyTrigger="sbbMenuTrigger"
          type="button"
        >
          Three
        </button>
      }
    </sbb-menu>

    <sbb-menu #levelOne="sbbMenu" (closed)="levelOneCloseCallback($event)">
      <button sbb-menu-item type="button">Four</button>
      <button
        sbb-menu-item
        id="level-two-trigger"
        [sbbMenuTriggerFor]="levelTwo"
        #levelTwoTrigger="sbbMenuTrigger"
        type="button"
      >
        Five
      </button>
      <button sbb-menu-item type="button">Six</button>
    </sbb-menu>

    <sbb-menu #levelTwo="sbbMenu" (closed)="levelTwoCloseCallback($event)">
      <button sbb-menu-item type="button">Seven</button>
      <button sbb-menu-item type="button">Eight</button>
      <button sbb-menu-item type="button">Nine</button>
    </sbb-menu>

    <sbb-menu #lazy="sbbMenu">
      <button sbb-menu-item type="button">Ten</button>
      <button sbb-menu-item type="button">Eleven</button>
      <button sbb-menu-item type="button">Twelve</button>
    </sbb-menu>
  `,
})
class NestedMenu {
  @ViewChild('root') rootMenu: SbbMenu;
  @ViewChild('rootTrigger') rootTrigger: SbbMenuTrigger;
  @ViewChild('rootTriggerEl') rootTriggerEl: ElementRef<HTMLElement>;
  @ViewChild('alternateTrigger') alternateTrigger: SbbMenuTrigger;
  readonly rootCloseCallback = jasmine.createSpy('root menu closed callback');

  @ViewChild('levelOne') levelOneMenu: SbbMenu;
  @ViewChild('levelOneTrigger') levelOneTrigger: SbbMenuTrigger;
  readonly levelOneCloseCallback = jasmine.createSpy('level one menu closed callback');

  @ViewChild('levelTwo') levelTwoMenu: SbbMenu;
  @ViewChild('levelTwoTrigger') levelTwoTrigger: SbbMenuTrigger;
  readonly levelTwoCloseCallback = jasmine.createSpy('level one menu closed callback');

  @ViewChild('lazy') lazyMenu: SbbMenu;
  @ViewChild('lazyTrigger') lazyTrigger: SbbMenuTrigger;
  showLazy = false;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="root" #rootTrigger="sbbMenuTrigger" type="button">
      Toggle menu
    </button>

    <sbb-menu #root="sbbMenu">
      <button
        sbb-menu-item
        [sbbMenuTriggerFor]="levelOne"
        #levelOneTrigger="sbbMenuTrigger"
        type="button"
      >
        One
      </button>
    </sbb-menu>

    <sbb-menu #levelOne="sbbMenu" class="sbb-elevation-z24">
      <button sbb-menu-item>Two</button>
    </sbb-menu>
  `,
})
class NestedMenuCustomElevation {
  @ViewChild('rootTrigger') rootTrigger: SbbMenuTrigger;
  @ViewChild('levelOneTrigger') levelOneTrigger: SbbMenuTrigger;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="root" #rootTriggerEl>Toggle menu</button>
    <sbb-menu #root="sbbMenu">
      @for (item of items; track item) {
        <button sbb-menu-item class="level-one-trigger" [sbbMenuTriggerFor]="levelOne">
          {{ item }}
        </button>
      }
    </sbb-menu>

    <sbb-menu #levelOne="sbbMenu">
      <button sbb-menu-item>Four</button>
      <button sbb-menu-item>Five</button>
    </sbb-menu>
  `,
})
class NestedMenuRepeater {
  @ViewChild('rootTriggerEl') rootTriggerEl: ElementRef<HTMLElement>;
  @ViewChild('levelOneTrigger') levelOneTrigger: SbbMenuTrigger;

  items = ['one', 'two', 'three'];
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="root" #rootTriggerEl>Toggle menu</button>

    <sbb-menu #root="sbbMenu">
      <button sbb-menu-item class="level-one-trigger" [sbbMenuTriggerFor]="levelOne">One</button>

      <sbb-menu #levelOne="sbbMenu">
        <button sbb-menu-item class="level-two-item">Two</button>
      </sbb-menu>
    </sbb-menu>
  `,
})
class SubmenuDeclaredInsideParentMenu {
  @ViewChild('rootTriggerEl') rootTriggerEl: ElementRef;
}

@Component({
  selector: 'sbb-fake-icon',
  template: '<ng-content></ng-content>',
})
class FakeIcon {}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu" #triggerEl>Toggle menu</button>

    <sbb-menu #menu="sbbMenu">
      <ng-template sbbMenuContent>
        <button sbb-menu-item>Item</button>
        <button sbb-menu-item>Another item</button>
      </ng-template>
    </sbb-menu>
  `,
})
class SimpleLazyMenu {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild('triggerEl') triggerEl: ElementRef<HTMLElement>;
  @ViewChildren(SbbMenuItem) items: QueryList<SbbMenuItem>;
}

@Component({
  template: `
    <button
      [sbbMenuTriggerFor]="menu"
      [sbbMenuTriggerData]="{ label: 'one' }"
      #triggerOne="sbbMenuTrigger"
    >
      One
    </button>

    <button
      [sbbMenuTriggerFor]="menu"
      [sbbMenuTriggerData]="{ label: 'two' }"
      #triggerTwo="sbbMenuTrigger"
    >
      Two
    </button>

    <sbb-menu #menu="sbbMenu">
      <ng-template let-label="label" sbbMenuContent>
        <button sbb-menu-item>{{ label }}</button>
      </ng-template>
    </sbb-menu>
  `,
})
class LazyMenuWithContext {
  @ViewChild('triggerOne') triggerOne: SbbMenuTrigger;
  @ViewChild('triggerTwo') triggerTwo: SbbMenuTrigger;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="one">Toggle menu</button>
    <sbb-menu #one="sbbMenu">
      <button sbb-menu-item>One</button>
    </sbb-menu>

    <sbb-menu #two="sbbMenu">
      <button sbb-menu-item>Two</button>
    </sbb-menu>
  `,
})
class DynamicPanelMenu {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild('one') firstMenu: SbbMenu;
  @ViewChild('two') secondMenu: SbbMenu;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu">Toggle menu</button>

    <sbb-menu #menu="sbbMenu">
      <button sbb-menu-item role="menuitemcheckbox" aria-checked="true">Checked</button>
      <button sbb-menu-item role="menuitemcheckbox" aria-checked="false">Not checked</button>
    </sbb-menu>
  `,
})
class MenuWithCheckboxItems {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu">Toggle menu</button>
    <sbb-menu #menu="sbbMenu">
      @for (item of items; track item) {
        <button [disabled]="item.disabled" sbb-menu-item>
          {{ item.label }}
        </button>
      }
    </sbb-menu>
  `,
})
class SimpleMenuWithRepeater {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild(SbbMenu) menu: SbbMenu;
  @ViewChildren(SbbMenuItem) itemInstances: QueryList<SbbMenuItem>;
  items = [
    { label: 'Pizza', disabled: false },
    { label: 'Pasta', disabled: false },
  ];
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu">Toggle menu</button>
    <sbb-menu #menu="sbbMenu">
      <ng-template sbbMenuContent>
        @for (item of items; track item) {
          <button [disabled]="item.disabled" sbb-menu-item>
            {{ item.label }}
          </button>
        }
      </ng-template>
    </sbb-menu>
  `,
})
class SimpleMenuWithRepeaterInLazyContent {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild(SbbMenu) menu: SbbMenu;
  items = [
    { label: 'Pizza', disabled: false },
    { label: 'Pasta', disabled: false },
  ];
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu" #triggerEl>Toggle menu</button>

    <sbb-menu #menu="sbbMenu">
      <ng-template sbbMenuContent>
        <button [sbbMenuTriggerFor]="menu2" sbb-menu-item #menuItem>Item</button>
      </ng-template>
    </sbb-menu>

    <sbb-menu #menu2="sbbMenu">
      <ng-template sbbMenuContent>
        <button sbb-menu-item #subMenuItem>Sub item</button>
      </ng-template>
    </sbb-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class LazyMenuWithOnPush {
  @ViewChild('triggerEl', { read: ElementRef }) rootTrigger: ElementRef;
  @ViewChild('menuItem', { read: ElementRef }) menuItemWithSubmenu: ElementRef;
}

@Component({
  template: `
    <sbb-menu #menu="sbbMenu">
      <button [sbbMenuTriggerFor]="menu"></button>
    </sbb-menu>
  `,
})
class InvalidRecursiveMenu {}

@Component({
  template: '<sbb-menu aria-label="label"></sbb-menu>',
})
class StaticAriaLabelMenu {}

@Component({
  template: '<sbb-menu aria-labelledby="some-element"></sbb-menu>',
})
class StaticAriaLabelledByMenu {}

@Component({
  template: '<sbb-menu aria-describedby="some-element"></sbb-menu>',
})
class StaticAriaDescribedbyMenu {}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu" #triggerEl>Toggle menu</button>
    <sbb-menu #menu="sbbMenu">
      @for (item of items; track item) {
        <button sbb-menu-item>{{ item }}</button>
      }
    </sbb-menu>
  `,
})
class MenuWithRepeatedItems {
  @ViewChild(SbbMenuTrigger, { static: false }) trigger: SbbMenuTrigger;
  @ViewChild('triggerEl', { static: false }) triggerEl: ElementRef<HTMLElement>;
  @ViewChild(SbbMenu, { static: false }) menu: SbbMenu;
  items = ['One', 'Two', 'Three'];
}

@Component({
  template: `<button [sbbMenuTriggerFor]="animals" aria-label="Show animals">
      <sbb-icon svgIcon="context-menu-small"></sbb-icon>
    </button>
    <sbb-menu #animals="sbbMenu">
      <button sbb-menu-item>Invertebrates</button>
    </sbb-menu>`,
})
class ContextmenuStaticTrigger {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild(SbbMenu) menu: SbbMenu;
}

@Component({
  template: `<button [sbbMenuTriggerFor]="animals" aria-label="Show animals">
      <sbb-icon *sbbMenuDynamicTrigger svgIcon="context-menu-small"></sbb-icon>
    </button>
    <sbb-menu #animals="sbbMenu">
      <button sbb-menu-item>Invertebrates</button>
    </sbb-menu>`,
})
class ContextmenuDynamicTrigger {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild(SbbMenu) menu: SbbMenu;
}

@Component({
  template: `<button [sbbMenuTriggerFor]="animals" aria-label="Show animals">
      I'm only a simple text
    </button>
    <sbb-menu #animals="sbbMenu">
      <button sbb-menu-item>Invertebrates</button>
    </sbb-menu>`,
})
class ContextmenuOnlyTextTrigger {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild(SbbMenu) menu: SbbMenu;
}

@Component({
  template: `<button [sbbMenuHeadlessTriggerFor]="animals" aria-label="Show animals">
      <sbb-icon svgIcon="context-menu-small"></sbb-icon>
    </button>
    <sbb-menu #animals="sbbMenu">
      <button sbb-menu-item>Invertebrates</button>
    </sbb-menu>`,
})
class HeadlessTrigger {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  @ViewChild(SbbMenu) menu: SbbMenu;
}

@Component({
  template: `<button [sbbContextmenuTriggerFor]="animals" aria-label="Show animals">
      I'm only a simple text
    </button>
    <sbb-menu #animals="sbbMenu">
      <button sbb-menu-item>Invertebrates</button>
    </sbb-menu>`,
})
class ContextmenuTrigger {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
}

@Component({
  template: `<button
      [sbbContextmenuTriggerFor]="animals"
      [svgIcon]="svgIcon"
      aria-label="Show animals"
    >
      I'm only a simple text
    </button>
    <sbb-menu #animals="sbbMenu">
      <button sbb-menu-item>Invertebrates</button>
    </sbb-menu>`,
})
class ContextmenuCustomIconTrigger {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
  svgIcon = 'other-icon';
}

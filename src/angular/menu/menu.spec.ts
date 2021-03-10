import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
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
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  Provider,
  QueryList,
  TemplateRef,
  Type,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  createKeyboardEvent,
  createMouseEvent,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  MockNgZone,
  patchElementFocus,
} from '@sbb-esta/angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { Subject } from 'rxjs';

import {
  SbbMenu,
  SbbMenuItem,
  SbbMenuModule,
  SbbMenuPanel,
  SbbMenuPositionX,
  SbbMenuPositionY,
  SbbMenuTrigger,
  SBB_MENU_DEFAULT_OPTIONS,
} from './index';
import { MENU_PANEL_TOP_PADDING, SBB_MENU_SCROLL_STRATEGY } from './menu-trigger';

describe('SbbMenu', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let focusMonitor: FocusMonitor;

  function createComponent<T>(
    component: Type<T>,
    providers: Provider[] = [],
    declarations: any[] = []
  ): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [SbbMenuModule, NoopAnimationsModule, SbbIconModule, SbbIconTestingModule],
      declarations: [component, ...declarations],
      providers,
    }).compileComponents();

    inject([OverlayContainer, FocusMonitor], (oc: OverlayContainer, fm: FocusMonitor) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      focusMonitor = fm;
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  it('should aria-controls the menu panel', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    expect(fixture.componentInstance.triggerEl.nativeElement.getAttribute('aria-controls')).toBe(
      fixture.componentInstance.menu.panelId
    );
  });

  it('should open the menu as an idempotent operation', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Item');
      expect(overlayContainerElement.textContent).toContain('Disabled');
    }).not.toThrowError();
  });

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

    expect(overlayContainerElement.querySelector('.sbb-menu-panel')).toBeTruthy();

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
    fixture.detectChanges();

    // A click without a mousedown before it is considered a keyboard open.
    triggerEl.click();
    fixture.detectChanges();

    expect(overlayContainerElement.querySelector('.sbb-menu-panel')).toBeTruthy();

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
    document.body.removeChild(button);
    subscription.unsubscribe();
  }));

  it('should restore focus to the trigger immediately once the menu is closed', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    // A click without a mousedown before it is considered a keyboard open.
    triggerEl.click();
    fixture.detectChanges();

    expect(overlayContainerElement.querySelector('.sbb-menu-panel')).toBeTruthy();

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();
    // Note: don't add a `tick` here since we're testing
    // that focus is restored before the animation is done.

    expect(document.activeElement).toBe(triggerEl);
  });

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

    expect(overlayContainerElement.querySelector('.sbb-menu-panel')).toBeTruthy();

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

    expect(overlayContainerElement.querySelector('.sbb-menu-panel')).toBeTruthy();

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
    fixture.detectChanges();

    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;
    dispatchFakeEvent(triggerEl, 'mousedown');
    triggerEl.click();
    fixture.detectChanges();

    // Flush due to the additional tick that is necessary for the FocusMonitor.
    flush();

    expect(overlayContainerElement.querySelector('.sbb-menu-panel')!.scrollTop).toBe(0);
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
    dispatchEvent(triggerEl, createMouseEvent('mousedown', 50, 100, 2));

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

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;
    const event = createKeyboardEvent('keydown', ESCAPE);

    dispatchEvent(panel, event);
    fixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.textContent).toBe('');
    expect(event.defaultPrevented).toBe(true);
  }));

  it('should not close the menu when pressing ESCAPE with a modifier', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;
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

  it('should transfer any custom classes from the host to the overlay', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.componentInstance.panelClass = 'custom-one custom-two';
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const menuEl = fixture.debugElement.query(By.css('sbb-menu'))!.nativeElement;
    const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;

    expect(menuEl.classList).not.toContain('custom-one');
    expect(menuEl.classList).not.toContain('custom-two');

    expect(panel.classList).toContain('custom-one');
    expect(panel.classList).toContain('custom-two');
  });

  it('should not remove sbb-elevation class from overlay when panelClass is changed', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);

    fixture.componentInstance.panelClass = 'custom-one';
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;

    expect(panel.classList).toContain('custom-one');
    expect(panel.classList).toContain('sbb-elevation-z4');

    fixture.componentInstance.panelClass = 'custom-two';
    fixture.detectChanges();

    expect(panel.classList).not.toContain('custom-one');
    expect(panel.classList).toContain('custom-two');
    expect(panel.classList).toContain(
      'sbb-elevation-z4',
      'Expected sbb-elevation-z4 not to be removed'
    );
  });

  it('should set the "menu" role on the overlay panel', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const menuPanel = overlayContainerElement.querySelector('.sbb-menu-panel');

    expect(menuPanel).toBeTruthy('Expected to find a menu panel.');

    const role = menuPanel ? menuPanel.getAttribute('role') : '';
    expect(role).toBe('menu', 'Expected panel to have the "menu" role.');
  });

  it('should forward ARIA attributes to the menu panel', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    const instance = fixture.componentInstance;
    fixture.detectChanges();
    instance.trigger.openMenu();
    fixture.detectChanges();

    const menuPanel = overlayContainerElement.querySelector('.sbb-menu-panel')!;
    expect(menuPanel.hasAttribute('aria-label')).toBe(false);
    expect(menuPanel.hasAttribute('aria-labelledby')).toBe(false);
    expect(menuPanel.hasAttribute('aria-describedby')).toBe(false);

    // Note that setting all of these at the same time is invalid,
    // but it's up to the consumer to handle it correctly.
    instance.ariaLabel = 'Custom aria-label';
    instance.ariaLabelledby = 'custom-labelled-by';
    instance.ariaDescribedby = 'custom-described-by';
    fixture.detectChanges();

    expect(menuPanel.getAttribute('aria-label')).toBe('Custom aria-label');
    expect(menuPanel.getAttribute('aria-labelledby')).toBe('custom-labelled-by');
    expect(menuPanel.getAttribute('aria-describedby')).toBe('custom-described-by');

    // Change these to empty strings to make sure that we don't preserve empty attributes.
    instance.ariaLabel = instance.ariaLabelledby = instance.ariaDescribedby = '';
    fixture.detectChanges();

    expect(menuPanel.hasAttribute('aria-label')).toBe(false);
    expect(menuPanel.hasAttribute('aria-labelledby')).toBe(false);
    expect(menuPanel.hasAttribute('aria-describedby')).toBe(false);
  });

  it('should set the "menuitem" role on the items by default', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const items = Array.from(overlayContainerElement.querySelectorAll('.sbb-menu-item'));

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.getAttribute('role') === 'menuitem')).toBe(true);
  });

  it('should be able to set an alternate role on the menu items', () => {
    const fixture = createComponent(MenuWithCheckboxItems);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const items = Array.from(overlayContainerElement.querySelectorAll('.sbb-menu-item'));

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.getAttribute('role') === 'menuitemcheckbox')).toBe(true);
  });

  it('should not change focus origin if origin not specified for menu items', () => {
    const fixture = createComponent(MenuWithCheckboxItems);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    const [firstMenuItemDebugEl, secondMenuItemDebugEl] = fixture.debugElement.queryAll(
      By.css('.sbb-menu-item')
    )!;

    const firstMenuItemInstance = firstMenuItemDebugEl.componentInstance as SbbMenuItem;
    const secondMenuItemInstance = secondMenuItemDebugEl.componentInstance as SbbMenuItem;

    firstMenuItemDebugEl.nativeElement.blur();
    firstMenuItemInstance.focus('mouse');
    secondMenuItemDebugEl.nativeElement.blur();
    secondMenuItemInstance.focus();

    expect(secondMenuItemDebugEl.nativeElement.classList).toContain('cdk-focused');
    expect(secondMenuItemDebugEl.nativeElement.classList).toContain('cdk-mouse-focused');
  });

  it('should not throw an error on destroy', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    expect(fixture.destroy.bind(fixture)).not.toThrow();
  });

  it('should be able to extract the menu item text', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.first.getLabel()).toBe('Item');
  });

  it('should filter out icon nodes when figuring out the label', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const items = fixture.componentInstance.items.toArray();
    expect(items[2].getLabel()).toBe('Item with an icon');
  });

  it('should get the label of an item if the text is not in a direct descendant node', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const items = fixture.componentInstance.items.toArray();
    expect(items[3].getLabel()).toBe('Item with text inside span');
  });

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

  it('should close the menu when using the CloseScrollStrategy', fakeAsync(() => {
    const scrolledSubject = new Subject();
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
      [FakeIcon]
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

    const panel = document.querySelector('.sbb-menu-panel')! as HTMLElement;
    const items: HTMLElement[] = Array.from(
      panel.querySelectorAll('.sbb-menu-panel [sbb-menu-item]')
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
      document.querySelectorAll('.sbb-menu-panel [sbb-menu-item]')
    );

    items.forEach((item) => patchElementFocus(item));
    tick(500);
    tick();
    fixture.detectChanges();

    expect(items[0].classList).toContain('cdk-keyboard-focused');
  }));

  it('should toggle the aria-expanded attribute on the trigger', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();
    const triggerEl = fixture.componentInstance.triggerEl.nativeElement;

    expect(triggerEl.hasAttribute('aria-expanded')).toBe(false);

    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();

    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');

    fixture.componentInstance.trigger.closeMenu();
    fixture.detectChanges();

    expect(triggerEl.hasAttribute('aria-expanded')).toBe(false);
  });

  it('should throw the correct error if the menu is not defined after init', () => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.menu = null!;
    fixture.detectChanges();

    expect(() => {
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
    }).toThrowError(/must pass in an sbb-menu instance/);
  });

  it('should throw if assigning a menu that contains the trigger', () => {
    expect(() => {
      const fixture = createComponent(InvalidRecursiveMenu, [], [FakeIcon]);
      fixture.detectChanges();
    }).toThrowError(/menu cannot contain its own trigger/);
  });

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

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;
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

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;
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

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;
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

    const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;
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

  it('should focus the menu panel if all items are disabled', fakeAsync(() => {
    const fixture = createComponent(SimpleMenuWithRepeater, [], [FakeIcon]);
    fixture.componentInstance.items.forEach((item) => (item.disabled = true));
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(overlayContainerElement.querySelector('.sbb-menu-panel'));
  }));

  it('should focus the menu panel if all items are disabled inside lazy content', fakeAsync(() => {
    const fixture = createComponent(SimpleMenuWithRepeaterInLazyContent, [], [FakeIcon]);
    fixture.componentInstance.items.forEach((item) => (item.disabled = true));
    fixture.detectChanges();
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    expect(document.activeElement).toBe(overlayContainerElement.querySelector('.sbb-menu-panel'));
  }));

  it('should clear the static aria-label from the menu host', () => {
    const fixture = createComponent(StaticAriaLabelMenu);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('sbb-menu').hasAttribute('aria-label')).toBe(false);
  });

  it('should clear the static aria-labelledby from the menu host', () => {
    const fixture = createComponent(StaticAriaLabelledByMenu);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('sbb-menu').hasAttribute('aria-labelledby')).toBe(
      false
    );
  });

  it('should clear the static aria-describedby from the menu host', () => {
    const fixture = createComponent(StaticAriaDescribedbyMenu);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('sbb-menu').hasAttribute('aria-describedby')).toBe(
      false
    );
  });

  it('should be able to move focus inside the `open` event', fakeAsync(() => {
    const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
    fixture.detectChanges();

    fixture.componentInstance.trigger.menuOpened.subscribe(() => {
      (document.querySelectorAll('.sbb-menu-panel [sbb-menu-item]')[3] as HTMLElement).focus();
    });
    fixture.componentInstance.trigger.openMenu();
    fixture.detectChanges();
    tick(500);

    const items = document.querySelectorAll('.sbb-menu-panel [sbb-menu-item]');
    expect(document.activeElement).toBe(items[3], 'Expected fourth item to be focused');
  }));

  describe('lazy rendering', () => {
    it('should be able to render the menu content lazily', fakeAsync(() => {
      const fixture = createComponent(SimpleLazyMenu);

      fixture.detectChanges();
      fixture.componentInstance.triggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      const panel = overlayContainerElement.querySelector('.sbb-menu-panel')!;

      expect(panel).toBeTruthy('Expected panel to be defined');
      expect(panel.textContent).toContain('Another item', 'Expected panel to have correct content');
      expect(fixture.componentInstance.trigger.menuOpen).toBe(true, 'Expected menu to be open');
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

      expect(trigger.menuOpen).toBe(false, 'Expected menu to start off closed');

      trigger.openMenu();
      fixture.detectChanges();
      tick(500);

      expect(trigger.menuOpen).toBe(true, 'Expected menu to be open');

      trigger.closeMenu();
      fixture.detectChanges();

      expect(trigger.menuOpen).toBe(
        true,
        'Expected menu to be considered open while the close animation is running'
      );
      tick(500);
      fixture.detectChanges();

      expect(trigger.menuOpen).toBe(false, 'Expected menu to be closed');
    }));

    it('should focus the first menu item when opening a lazy menu via keyboard', fakeAsync(() => {
      let zone: MockNgZone;
      const fixture = createComponent(SimpleLazyMenu, [
        {
          provide: NgZone,
          useFactory: () => (zone = new MockNgZone()),
        },
      ]);

      fixture.detectChanges();

      // A click without a mousedown before it is considered a keyboard open.
      fixture.componentInstance.triggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);
      zone!.simulateZoneExit();

      // Flush due to the additional tick that is necessary for the FocusMonitor.
      flush();

      const item = document.querySelector('.sbb-menu-panel [sbb-menu-item]')!;

      expect(document.activeElement).toBe(item, 'Expected first item to be focused');
    }));

    it('should be able to open the same menu with a different context', fakeAsync(() => {
      const fixture = createComponent(LazyMenuWithContext);

      fixture.detectChanges();
      fixture.componentInstance.triggerOne.openMenu();
      fixture.detectChanges();
      tick(500);

      let item = overlayContainerElement.querySelector('.sbb-menu-panel [sbb-menu-item]')!;

      expect(item.textContent!.trim()).toBe('one');

      fixture.componentInstance.triggerOne.closeMenu();
      fixture.detectChanges();
      tick(500);

      fixture.componentInstance.triggerTwo.openMenu();
      fixture.detectChanges();
      tick(500);
      item = overlayContainerElement.querySelector('.sbb-menu-panel [sbb-menu-item]')!;

      expect(item.textContent!.trim()).toBe('two');
    }));

    it(
      'should respect the DOM order, rather than insertion order, when moving focus using ' +
        'the arrow keys',
      fakeAsync(() => {
        const fixture = createComponent(SimpleMenuWithRepeater);

        fixture.detectChanges();
        fixture.componentInstance.trigger.openMenu();
        fixture.detectChanges();
        tick(500);

        const menuPanel = document.querySelector('.sbb-menu-panel')!;
        let items = menuPanel.querySelectorAll('.sbb-menu-panel [sbb-menu-item]');

        expect(document.activeElement).toBe(items[0], 'Expected first item to be focused on open');

        // Add a new item after the first one.
        fixture.componentInstance.items.splice(1, 0, { label: 'Calzone', disabled: false });
        fixture.detectChanges();

        items = menuPanel.querySelectorAll('.sbb-menu-panel [sbb-menu-item]');
        dispatchKeyboardEvent(menuPanel, 'keydown', DOWN_ARROW);
        fixture.detectChanges();
        tick();

        expect(document.activeElement).toBe(items[1], 'Expected second item to be focused');
        flush();
      })
    );

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

      const menuPanel = document.querySelector('.sbb-menu-panel')!;
      const items = menuPanel.querySelectorAll('.sbb-menu-panel [sbb-menu-item]');

      expect(document.activeElement).toBe(items[0], 'Expected first item to be focused on open');

      fixture.componentInstance.itemInstances.toArray()[3].focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(items[3], 'Expected fourth item to be focused');

      dispatchKeyboardEvent(menuPanel, 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(items[4], 'Expected fifth item to be focused');
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

      expect(overlayContainerElement.querySelectorAll('.sbb-menu-item').length).toBe(
        2,
        'Expected two open menus'
      );
    }));
  });

  describe('positions', () => {
    let fixture: ComponentFixture<PositionedMenu>;
    let trigger: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(PositionedMenu);
      fixture.detectChanges();

      trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the bottom edge of viewport,so it has space to open "above"
      trigger.style.position = 'fixed';
      trigger.style.top = '600px';

      // Push trigger to the right, so it has space to open "before"
      trigger.style.left = '100px';
    });

    it('should append sbb-menu-before if the x position is changed', () => {
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector('.sbb-menu-panel') as HTMLElement;

      expect(panel.classList).toContain('sbb-menu-before');
      expect(panel.classList).not.toContain('sbb-menu-after');

      fixture.componentInstance.xPosition = 'after';
      fixture.detectChanges();

      expect(panel.classList).toContain('sbb-menu-after');
      expect(panel.classList).not.toContain('sbb-menu-before');
    });

    it('should append sbb-menu-above if the y position is changed', () => {
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector('.sbb-menu-panel') as HTMLElement;

      expect(panel.classList).toContain('sbb-menu-above');
      expect(panel.classList).not.toContain('sbb-menu-below');

      fixture.componentInstance.yPosition = 'below';
      fixture.detectChanges();

      expect(panel.classList).toContain('sbb-menu-below');
      expect(panel.classList).not.toContain('sbb-menu-above');
    });

    it('should default to the "below" and "after" positions', () => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();

      const newFixture = createComponent(SimpleMenu, [], [FakeIcon]);

      newFixture.detectChanges();
      newFixture.componentInstance.trigger.openMenu();
      newFixture.detectChanges();
      const panel = overlayContainerElement.querySelector('.sbb-menu-panel') as HTMLElement;

      expect(panel.classList).toContain('sbb-menu-below');
      expect(panel.classList).toContain('sbb-menu-after');
    });

    it('should be able to update the position after the first open', () => {
      trigger.style.position = 'fixed';
      trigger.style.top = '200px';

      fixture.componentInstance.yPosition = 'above';
      fixture.detectChanges();

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();

      let panel = overlayContainerElement.querySelector('.sbb-menu-panel') as HTMLElement;

      expect(Math.floor(panel.getBoundingClientRect().bottom)).toBeCloseTo(
        Math.floor(trigger.getBoundingClientRect().top),
        '-1',
        'Expected menu to open above'
      );

      fixture.componentInstance.trigger.closeMenu();
      fixture.detectChanges();

      fixture.componentInstance.yPosition = 'below';
      fixture.detectChanges();

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      panel = overlayContainerElement.querySelector('.sbb-menu-panel') as HTMLElement;

      // Add 2px border width
      expect(Math.floor(panel.getBoundingClientRect().top) + 2).toBe(
        Math.floor(trigger.getBoundingClientRect().bottom),
        'Expected menu to open below'
      );
    });
  });

  describe('fallback positions', () => {
    it('should fall back to "before" mode if "after" mode would not fit on screen', () => {
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
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      // In "before" position, the right sides of the overlay and the origin are aligned.
      // To find the overlay left, subtract the menu width from the origin's right side.
      const expectedLeft = triggerRect.right - overlayRect.width;
      expect(Math.abs(Math.floor(overlayRect.left) - Math.floor(expectedLeft))).toBeLessThanOrEqual(
        1,
        `Expected menu to open in "before" position if "after" position wouldn't fit.`
      );

      // The y-position of the overlay should be unaffected, as it can already fit vertically
      expect(Math.floor(overlayRect.top)).toBe(
        Math.floor(triggerRect.bottom),
        `Expected menu top position to be unchanged if it can fit in the viewport.`
      );
    });

    it('should fall back to "above" mode if "below" mode would not fit on screen', () => {
      const fixture = createComponent(SimpleMenu, [], [FakeIcon]);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the bottom part of viewport, so it doesn't have space to open
      // in its default "below" position below the trigger.
      trigger.style.position = 'fixed';
      trigger.style.bottom = '65px';

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      expect(Math.floor(overlayRect.bottom)).toBe(
        Math.floor(triggerRect.top),
        `Expected menu to open in "above" position if "below" position wouldn't fit.`
      );

      // The x-position of the overlay should be unaffected, as it can already fit horizontally
      expect(Math.floor(overlayRect.left)).toBe(
        Math.floor(triggerRect.left),
        `Expected menu x position to be unchanged if it can fit in the viewport.`
      );
    });

    it('should re-position menu on both axes if both defaults would not fit', () => {
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
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      const expectedLeft = triggerRect.right - overlayRect.width;

      expect(Math.abs(Math.floor(overlayRect.left) - Math.floor(expectedLeft))).toBeLessThanOrEqual(
        1,
        `Expected menu to open in "before" position if "after" position wouldn't fit.`
      );

      expect(Math.floor(overlayRect.bottom)).toBe(
        Math.floor(triggerRect.top),
        `Expected menu to open in "above" position if "below" position wouldn't fit.`
      );
    });

    it('should re-position a menu with custom position set', () => {
      const fixture = createComponent(PositionedMenu);
      fixture.componentInstance.marginleft = 0;
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      // As designated "before" position won't fit on screen, the menu should fall back
      // to "after" mode, where the left sides of the overlay and trigger are aligned.
      expect(Math.floor(overlayRect.left)).toBe(
        Math.floor(triggerRect.left),
        `Expected menu to open in "after" position if "before" position wouldn't fit.`
      );

      // As designated "above" position won't fit on screen, the menu should fall back
      // to "below" mode, where the top edges of the overlay and trigger are aligned.
      expect(Math.floor(overlayRect.top)).toBe(
        Math.floor(triggerRect.bottom),
        `Expected menu to open in "below" position if "above" position wouldn't fit.`
      );
    });

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
          (key) => ((this.fixture.componentInstance as any)[key] = inputs[key])
        );
        this.fixture.detectChanges();
        this.trigger = this.fixture.componentInstance.triggerEl.nativeElement;
      }

      openMenu() {
        this.fixture.componentInstance.trigger.openMenu();
        this.fixture.detectChanges();
      }

      get overlayRect() {
        return this._getOverlayPane().getBoundingClientRect();
      }

      get triggerRect() {
        return this.trigger.getBoundingClientRect();
      }

      get menuPanel() {
        return overlayContainerElement.querySelector('.sbb-menu-panel');
      }

      private _getOverlayPane() {
        return overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
      }
    }

    let subject: OverlapSubject<OverlapMenu>;
    describe('explicitly overlapping', () => {
      beforeEach(() => {
        subject = new OverlapSubject(OverlapMenu, { overlapTrigger: true });
      });

      it('positions the overlay below the trigger', () => {
        subject.openMenu();

        // Since the menu is overlaying the trigger, the overlay top should be the trigger top.
        expect(Math.floor(subject.overlayRect.top)).toBe(
          Math.floor(subject.triggerRect.top),
          `Expected menu to open in default "below" position.`
        );
      });
    });

    describe('not overlapping', () => {
      beforeEach(() => {
        subject = new OverlapSubject(OverlapMenu, { overlapTrigger: false });
      });

      it('positions the overlay below the trigger', () => {
        subject.openMenu();

        // Since the menu is below the trigger, the overlay top should be the trigger bottom.
        expect(Math.floor(subject.overlayRect.top)).toBe(
          Math.floor(subject.triggerRect.bottom),
          `Expected menu to open directly below the trigger.`
        );
      });

      it('supports above position fall back', () => {
        // Push trigger to the bottom part of viewport, so it doesn't have space to open
        // in its default "below" position below the trigger.
        subject.trigger.style.position = 'fixed';
        subject.trigger.style.bottom = '0';
        subject.openMenu();

        // Since the menu is above the trigger, the overlay bottom should be the trigger top.
        expect(Math.floor(subject.overlayRect.bottom)).toBe(
          Math.floor(subject.triggerRect.top),
          `Expected menu to open in "above" position if "below" position wouldn't fit.`
        );
      });

      it('repositions the origin to be below, so the menu opens from the trigger', () => {
        subject.openMenu();
        subject.fixture.detectChanges();

        expect(subject.menuPanel!.classList).toContain('sbb-menu-below');
        expect(subject.menuPanel!.classList).not.toContain('sbb-menu-above');
      });
    });
  });

  describe('close event', () => {
    let fixture: ComponentFixture<SimpleMenu>;

    beforeEach(() => {
      fixture = createComponent(SimpleMenu, [], [FakeIcon]);
      fixture.detectChanges();
      fixture.componentInstance.trigger.openMenu();
      fixture.detectChanges();
    });

    it('should emit an event when a menu item is clicked', () => {
      const menuItem = overlayContainerElement.querySelector('[sbb-menu-item]') as HTMLElement;

      menuItem.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith('click');
      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(1);
    });

    it('should emit a close event when the backdrop is clicked', () => {
      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;

      backdrop.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith(undefined);
      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(1);
    });

    it('should emit an event when pressing ESCAPE', () => {
      const menu = overlayContainerElement.querySelector('.sbb-menu-panel') as HTMLElement;

      dispatchKeyboardEvent(menu, 'keydown', ESCAPE);
      fixture.detectChanges();

      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledWith('keydown');
      expect(fixture.componentInstance.closeCallback).toHaveBeenCalledTimes(1);
    });

    it('should complete the callback when the menu is destroyed', () => {
      const emitCallback = jasmine.createSpy('emit callback');
      const completeCallback = jasmine.createSpy('complete callback');

      fixture.componentInstance.menu.closed.subscribe(emitCallback, null, completeCallback);
      fixture.destroy();

      expect(emitCallback).toHaveBeenCalledWith(undefined);
      expect(emitCallback).toHaveBeenCalledTimes(1);
      expect(completeCallback).toHaveBeenCalled();
    });
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

    it('should set the `triggersSubmenu` flags on the triggers', () => {
      compileTestComponent();
      expect(instance.rootTrigger.triggersSubmenu()).toBe(false);
      expect(instance.levelOneTrigger.triggersSubmenu()).toBe(true);
      expect(instance.levelTwoTrigger.triggersSubmenu()).toBe(true);
    });

    it('should set the `parentMenu` on the sub-menu instances', () => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      expect(instance.rootMenu.parentMenu).toBeFalsy();
      expect(instance.levelOneMenu.parentMenu).toBe(instance.rootMenu);
      expect(instance.levelTwoMenu.parentMenu).toBe(instance.levelOneMenu);
    });

    it('should emit an event when the hover state of the menu items changes', () => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      const spy = jasmine.createSpy('hover spy');
      const subscription = instance.rootMenu._hovered().subscribe(spy);
      const menuItems = overlay.querySelectorAll('[sbb-menu-item]');

      dispatchMouseEvent(menuItems[0], 'mouseenter');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);

      dispatchMouseEvent(menuItems[1], 'mouseenter');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(2);

      subscription.unsubscribe();
    });

    it('should toggle a nested menu when its trigger is hovered', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');

      const items = Array.from(overlay.querySelectorAll('.sbb-menu-panel [sbb-menu-item]'));
      const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

      dispatchMouseEvent(levelOneTrigger, 'mouseenter');
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(levelOneTrigger.classList).toContain(
        'sbb-menu-item-highlighted',
        'Expected the trigger to be highlighted'
      );
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');

      dispatchMouseEvent(items[items.indexOf(levelOneTrigger) + 1], 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');
      expect(levelOneTrigger.classList).not.toContain(
        'sbb-menu-item-highlighted',
        'Expected the trigger to not be highlighted'
      );
    }));

    it('should close all the open sub-menus when the hover state is changed at the root', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      const items = Array.from(overlay.querySelectorAll('.sbb-menu-panel [sbb-menu-item]'));
      const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

      dispatchMouseEvent(levelOneTrigger, 'mouseenter');
      fixture.detectChanges();
      tick();

      const levelTwoTrigger = overlay.querySelector('#level-two-trigger')! as HTMLElement;
      dispatchMouseEvent(levelTwoTrigger, 'mouseenter');
      fixture.detectChanges();
      tick();

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
        3,
        'Expected three open menus'
      );

      dispatchMouseEvent(items[items.indexOf(levelOneTrigger) + 1], 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');
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

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');

      items[1].componentInstance.disabled = true;
      fixture.detectChanges();

      // Invoke the handler directly since the fake events are flaky on disabled elements.
      items[1].componentInstance._handleMouseEnter();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');
    }));

    it('should not open submenu when hovering over disabled trigger', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');

      const item = fixture.debugElement.query(By.directive(SbbMenuItem))!;

      item.componentInstance.disabled = true;
      fixture.detectChanges();

      // Invoke the handler directly since the fake events are flaky on disabled elements.
      item.componentInstance._handleMouseEnter();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
        1,
        'Expected to remain at one open menu'
      );
    }));

    it('should open a nested menu when its trigger is clicked', () => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');

      const levelOneTrigger = overlay.querySelector('#level-one-trigger')! as HTMLElement;

      levelOneTrigger.click();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');

      levelOneTrigger.click();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
        2,
        'Expected repeat clicks not to close the menu.'
      );
    });

    it('should open and close a nested menu with arrow keys in ltr', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');

      const levelOneTrigger = overlay.querySelector('#level-one-trigger')! as HTMLElement;

      dispatchKeyboardEvent(levelOneTrigger, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const panels = overlay.querySelectorAll('.sbb-menu-panel');

      expect(panels.length).toBe(2, 'Expected two open menus');
      dispatchKeyboardEvent(panels[1], 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1);
    }));

    it('should not do anything with the arrow keys for a top-level menu', () => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      const menu = overlay.querySelector('.sbb-menu-panel')!;

      dispatchKeyboardEvent(menu, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
        1,
        'Expected one menu to remain open'
      );

      dispatchKeyboardEvent(menu, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
        1,
        'Expected one menu to remain open'
      );
    });

    it('should close all of the menus when the backdrop is clicked', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
        3,
        'Expected three open menus'
      );
      expect(overlay.querySelectorAll('.cdk-overlay-backdrop').length).toBe(
        1,
        'Expected one backdrop element'
      );
      expect(
        overlay.querySelectorAll('.sbb-menu-panel, .cdk-overlay-backdrop')[0].classList
      ).toContain('cdk-overlay-backdrop', 'Expected backdrop to be beneath all of the menus');

      (overlay.querySelector('.cdk-overlay-backdrop')! as HTMLElement).click();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(0, 'Expected no open menus');
    }));

    it('should shift focus between the sub-menus', () => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      expect(overlay.querySelector('.sbb-menu-panel')!.contains(document.activeElement)).toBe(
        true,
        'Expected focus to be inside the root menu'
      );

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      expect(overlay.querySelectorAll('.sbb-menu-panel')[1].contains(document.activeElement)).toBe(
        true,
        'Expected focus to be inside the first nested menu'
      );

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      expect(overlay.querySelectorAll('.sbb-menu-panel')[2].contains(document.activeElement)).toBe(
        true,
        'Expected focus to be inside the second nested menu'
      );

      instance.levelTwoTrigger.closeMenu();
      fixture.detectChanges();

      expect(overlay.querySelectorAll('.sbb-menu-panel')[1].contains(document.activeElement)).toBe(
        true,
        'Expected focus to be back inside the first nested menu'
      );

      instance.levelOneTrigger.closeMenu();
      fixture.detectChanges();

      expect(overlay.querySelector('.sbb-menu-panel')!.contains(document.activeElement)).toBe(
        true,
        'Expected focus to be back inside the root menu'
      );
    });

    it('should restore focus to a nested trigger when navgating via the keyboard', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      const levelOneTrigger = overlay.querySelector('#level-one-trigger')! as HTMLElement;
      dispatchKeyboardEvent(levelOneTrigger, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const spy = spyOn(levelOneTrigger, 'focus').and.callThrough();
      dispatchKeyboardEvent(overlay.querySelectorAll('.sbb-menu-panel')[1], 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      tick(500);

      expect(spy).toHaveBeenCalled();
    }));

    it('should position the sub-menu to the right edge of the trigger in ltr', () => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.style.position = 'fixed';
      instance.rootTriggerEl.nativeElement.style.left = '50px';
      instance.rootTriggerEl.nativeElement.style.top = '50px';
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      const triggerRect = overlay.querySelector('#level-one-trigger')!.getBoundingClientRect();
      const panelRect = overlay.querySelectorAll('.cdk-overlay-pane')[1].getBoundingClientRect();

      // Subtract 3px space
      expect(Math.round(triggerRect.right) - 3).toBe(Math.round(panelRect.left));
      expect(Math.round(triggerRect.top)).toBe(Math.round(panelRect.top) + MENU_PANEL_TOP_PADDING);
    });

    it('should fall back to aligning to the left edge of the trigger in ltr', () => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.style.position = 'fixed';
      instance.rootTriggerEl.nativeElement.style.right = '10px';
      instance.rootTriggerEl.nativeElement.style.top = '50%';
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      const triggerRect = overlay.querySelector('#level-one-trigger')!.getBoundingClientRect();
      const panelRect = overlay.querySelectorAll('.cdk-overlay-pane')[1].getBoundingClientRect();

      // Add 3px space
      expect(Math.round(triggerRect.left) + 3).toBe(Math.round(panelRect.right));
      expect(Math.round(triggerRect.top)).toBe(Math.round(panelRect.top) + MENU_PANEL_TOP_PADDING);
    });

    it('should close all of the menus when an item is clicked', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      const menus = overlay.querySelectorAll('.sbb-menu-panel');

      expect(menus.length).toBe(3, 'Expected three open menus');

      (menus[2].querySelector('.sbb-menu-item')! as HTMLElement).click();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(0, 'Expected no open menus');
    }));

    it('should close all of the menus when the user tabs away', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      const menus = overlay.querySelectorAll('.sbb-menu-panel');

      expect(menus.length).toBe(3, 'Expected three open menus');

      dispatchKeyboardEvent(menus[menus.length - 1], 'keydown', TAB);
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(0, 'Expected no open menus');
    }));

    it('should set a class on the menu items that trigger a sub-menu', () => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      const menuItems = overlay.querySelectorAll('[sbb-menu-item]');

      expect(menuItems[0].classList).toContain('sbb-menu-item-submenu-trigger');
      expect(menuItems[1].classList).not.toContain('sbb-menu-item-submenu-trigger');
    });

    it('should increase the sub-menu elevation based on its depth', () => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      const menus = overlay.querySelectorAll('.sbb-menu-panel');

      expect(menus[0].classList).toContain(
        'sbb-elevation-z4',
        'Expected root menu to have base elevation.'
      );
      expect(menus[1].classList).toContain(
        'sbb-elevation-z5',
        'Expected first sub-menu to have base elevation + 1.'
      );
      expect(menus[2].classList).toContain(
        'sbb-elevation-z6',
        'Expected second sub-menu to have base elevation + 2.'
      );
    });

    it('should update the elevation when the same menu is opened at a different depth', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      let lastMenu = overlay.querySelectorAll('.sbb-menu-panel')[2];

      expect(lastMenu.classList).toContain(
        'sbb-elevation-z6',
        'Expected menu to have the base elevation plus two.'
      );

      (overlay.querySelector('.cdk-overlay-backdrop')! as HTMLElement).click();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(0, 'Expected no open menus');

      instance.alternateTrigger.openMenu();
      fixture.detectChanges();
      tick(500);

      lastMenu = overlay.querySelector('.sbb-menu-panel') as HTMLElement;

      expect(lastMenu.classList).not.toContain(
        'sbb-elevation-z6',
        'Expected menu not to maintain old elevation.'
      );
      expect(lastMenu.classList).toContain(
        'sbb-elevation-z4',
        'Expected menu to have the proper updated elevation.'
      );
    }));

    it('should not change focus origin if origin not specified for trigger', fakeAsync(() => {
      compileTestComponent();

      instance.levelOneTrigger.openMenu();
      instance.levelOneTrigger.focus('mouse');
      fixture.detectChanges();

      instance.levelTwoTrigger.focus();
      fixture.detectChanges();
      tick(500);

      const levelTwoTrigger = overlay.querySelector('#level-two-trigger')! as HTMLElement;

      expect(levelTwoTrigger.classList).toContain('cdk-focused');
      expect(levelTwoTrigger.classList).toContain('cdk-mouse-focused');
    }));

    it('should not increase the elevation if the user specified a custom one', () => {
      const elevationFixture = createComponent(NestedMenuCustomElevation);

      elevationFixture.detectChanges();
      elevationFixture.componentInstance.rootTrigger.openMenu();
      elevationFixture.detectChanges();

      elevationFixture.componentInstance.levelOneTrigger.openMenu();
      elevationFixture.detectChanges();

      const menuClasses = overlayContainerElement.querySelectorAll('.sbb-menu-panel')[1].classList;

      expect(menuClasses).toContain(
        'sbb-elevation-z24',
        'Expected user elevation to be maintained'
      );
      expect(menuClasses).not.toContain('sbb-elevation-z3', 'Expected no stacked elevation.');
    });

    it('should close all of the menus when the root is closed programmatically', fakeAsync(() => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      instance.levelOneTrigger.openMenu();
      fixture.detectChanges();

      instance.levelTwoTrigger.openMenu();
      fixture.detectChanges();

      const menus = overlay.querySelectorAll('.sbb-menu-panel');

      expect(menus.length).toBe(3, 'Expected three open menus');

      instance.rootTrigger.closeMenu();
      fixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(0, 'Expected no open menus');
    }));

    it('should toggle a nested menu when its trigger is added after init', fakeAsync(() => {
      compileTestComponent();
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');

      instance.showLazy = true;
      fixture.detectChanges();

      const lazyTrigger = overlay.querySelector('#lazy-trigger')!;

      dispatchMouseEvent(lazyTrigger, 'mouseenter');
      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();

      expect(lazyTrigger.classList).toContain(
        'sbb-menu-item-highlighted',
        'Expected the trigger to be highlighted'
      );
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');
    }));

    it('should prevent the default mousedown action if the menu item opens a sub-menu', () => {
      compileTestComponent();
      instance.rootTrigger.openMenu();
      fixture.detectChanges();

      const event = createMouseEvent('mousedown');

      Object.defineProperty(event, 'buttons', { get: () => 1 });
      event.preventDefault = jasmine.createSpy('preventDefault spy');

      dispatchEvent(overlay.querySelector('[sbb-menu-item]')!, event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle the items being rendered in a repeater', fakeAsync(() => {
      const repeaterFixture = createComponent(NestedMenuRepeater);
      overlay = overlayContainerElement;

      expect(() => repeaterFixture.detectChanges()).not.toThrow();

      repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');

      dispatchMouseEvent(overlay.querySelector('.level-one-trigger')!, 'mouseenter');
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');
    }));

    it('should be able to trigger the same nested menu from different triggers', fakeAsync(() => {
      const repeaterFixture = createComponent(NestedMenuRepeater);
      overlay = overlayContainerElement;

      repeaterFixture.detectChanges();
      repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');

      const triggers = overlay.querySelectorAll('.level-one-trigger');

      dispatchMouseEvent(triggers[0], 'mouseenter');
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');

      dispatchMouseEvent(triggers[1], 'mouseenter');
      repeaterFixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');
    }));

    it('should close the initial menu if the user moves away while animating', fakeAsync(() => {
      const repeaterFixture = createComponent(NestedMenuRepeater);
      overlay = overlayContainerElement;

      repeaterFixture.detectChanges();
      repeaterFixture.componentInstance.rootTriggerEl.nativeElement.click();
      repeaterFixture.detectChanges();
      tick(500);
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(1, 'Expected one open menu');

      const triggers = overlay.querySelectorAll('.level-one-trigger');

      dispatchMouseEvent(triggers[0], 'mouseenter');
      repeaterFixture.detectChanges();
      tick(100);
      dispatchMouseEvent(triggers[1], 'mouseenter');
      repeaterFixture.detectChanges();
      tick(500);

      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');
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
        expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        dispatchMouseEvent(overlay.querySelector('.level-one-trigger')!, 'mouseenter');
        nestedFixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );
      })
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
        expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
          1,
          'Expected one open menu'
        );

        dispatchMouseEvent(overlay.querySelector('.level-one-trigger')!, 'mouseenter');
        nestedFixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
          2,
          'Expected two open menus'
        );

        dispatchMouseEvent(overlay.querySelector('.level-two-item')!, 'mouseenter');
        nestedFixture.detectChanges();
        tick(500);

        expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(
          2,
          'Expected two open menus to remain'
        );
      })
    );

    it('should not re-focus a child menu trigger when hovering another trigger', fakeAsync(() => {
      compileTestComponent();

      dispatchFakeEvent(instance.rootTriggerEl.nativeElement, 'mousedown');
      instance.rootTriggerEl.nativeElement.click();
      fixture.detectChanges();

      const items = Array.from(overlay.querySelectorAll('.sbb-menu-panel [sbb-menu-item]'));
      const levelOneTrigger = overlay.querySelector('#level-one-trigger')!;

      dispatchMouseEvent(levelOneTrigger, 'mouseenter');
      fixture.detectChanges();
      tick();
      expect(overlay.querySelectorAll('.sbb-menu-panel').length).toBe(2, 'Expected two open menus');

      dispatchMouseEvent(items[items.indexOf(levelOneTrigger) + 1], 'mouseenter');
      fixture.detectChanges();
      tick(500);

      expect(document.activeElement).not.toBe(
        levelOneTrigger,
        'Expected focus not to be returned to the initial trigger.'
      );
    }));
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
    }).compileComponents();
  }));

  it('should allow for the default menu options to be overridden', () => {
    const fixture = TestBed.createComponent(SimpleMenu);
    fixture.detectChanges();
    const menu = fixture.componentInstance.menu;

    expect(menu.overlapTrigger).toBe(true);
    expect(menu.xPosition).toBe('before');
    expect(menu.yPosition).toBe('above');
  });
});

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu" [sbbMenuTriggerRestoreFocus]="restoreFocus" #triggerEl>
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
      <button sbb-menu-item>Item</button>
      <button sbb-menu-item disabled>Disabled</button>
      <button sbb-menu-item>
        <sbb-icon svgIcon="unicorn"></sbb-icon>
        Item with an icon
      </button>
      <button sbb-menu-item>
        <span>Item with text inside span</span>
      </button>
      <button *ngFor="let item of extraItems" sbb-menu-item>{{ item }}</button>
    </sbb-menu>
  `,
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

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu" #triggerEl [style.marginLeft]="marginleft + 'px'">
      Toggle menu
    </button>
    <sbb-menu [xPosition]="xPosition" [yPosition]="yPosition" #menu="sbbMenu">
      <button sbb-menu-item>Positioned Content</button>
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
    <button [sbbMenuTriggerFor]="menu" #triggerEl>Toggle menu</button>
    <sbb-menu [overlapTrigger]="overlapTrigger" #menu="sbbMenu">
      <button sbb-menu-item>Not overlapped Content</button>
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
  exportAs: 'matCustomMenu',
})
class CustomMenuPanel implements SbbMenuPanel {
  direction: Direction;
  xPosition: SbbMenuPositionX = 'after';
  yPosition: SbbMenuPositionY = 'below';
  overlapTrigger = true;
  parentMenu: SbbMenuPanel;

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  @Output() closed = new EventEmitter<void | 'click' | 'keydown' | 'tab'>();
  focusFirstItem = () => {};
  resetActiveItem = () => {};
  setPositionClasses = () => {};

  triggerWidth: number;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="menu">Toggle menu</button>
    <custom-menu #menu="matCustomMenu">
      <button sbb-menu-item>Custom Content</button>
    </custom-menu>
  `,
})
class CustomMenu {
  @ViewChild(SbbMenuTrigger) trigger: SbbMenuTrigger;
}

@Component({
  template: `
    <button [sbbMenuTriggerFor]="root" #rootTrigger="sbbMenuTrigger" #rootTriggerEl>
      Toggle menu
    </button>

    <button [sbbMenuTriggerFor]="levelTwo" #alternateTrigger="sbbMenuTrigger">
      Toggle alternate menu
    </button>

    <sbb-menu #root="sbbMenu" (closed)="rootCloseCallback($event)">
      <button
        sbb-menu-item
        id="level-one-trigger"
        [sbbMenuTriggerFor]="levelOne"
        #levelOneTrigger="sbbMenuTrigger"
      >
        One
      </button>
      <button sbb-menu-item>Two</button>
      <button
        sbb-menu-item
        *ngIf="showLazy"
        id="lazy-trigger"
        [sbbMenuTriggerFor]="lazy"
        #lazyTrigger="sbbMenuTrigger"
      >
        Three
      </button>
    </sbb-menu>

    <sbb-menu #levelOne="sbbMenu" (closed)="levelOneCloseCallback($event)">
      <button sbb-menu-item>Four</button>
      <button
        sbb-menu-item
        id="level-two-trigger"
        [sbbMenuTriggerFor]="levelTwo"
        #levelTwoTrigger="sbbMenuTrigger"
      >
        Five
      </button>
      <button sbb-menu-item>Six</button>
    </sbb-menu>

    <sbb-menu #levelTwo="sbbMenu" (closed)="levelTwoCloseCallback($event)">
      <button sbb-menu-item>Seven</button>
      <button sbb-menu-item>Eight</button>
      <button sbb-menu-item>Nine</button>
    </sbb-menu>

    <sbb-menu #lazy="sbbMenu">
      <button sbb-menu-item>Ten</button>
      <button sbb-menu-item>Eleven</button>
      <button sbb-menu-item>Twelve</button>
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
    <button [sbbMenuTriggerFor]="root" #rootTrigger="sbbMenuTrigger">Toggle menu</button>

    <sbb-menu #root="sbbMenu">
      <button sbb-menu-item [sbbMenuTriggerFor]="levelOne" #levelOneTrigger="sbbMenuTrigger">
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
      <button
        sbb-menu-item
        class="level-one-trigger"
        *ngFor="let item of items"
        [sbbMenuTriggerFor]="levelOne"
      >
        {{ item }}
      </button>
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
      <button *ngFor="let item of items" [disabled]="item.disabled" sbb-menu-item>
        {{ item.label }}
      </button>
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
        <button *ngFor="let item of items" [disabled]="item.disabled" sbb-menu-item>
          {{ item.label }}
        </button>
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

import { AnimationEvent } from '@angular/animations';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import { CdkScrollable, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';
import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  patchElementFocus,
} from '@sbb-esta/angular-core/testing';

import { SbbTooltipModule } from '../tooltip.module';

import { SbbTooltip, SBB_TOOLTIP_DEFAULT_OPTIONS, SBB_TOOLTIP_PANEL_CLASS } from './tooltip';

// tslint:disable: no-non-null-assertion

const initialTooltipMessage = 'initial tooltip message';

describe('Tooltip', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let dir: { value: Direction };
  let platform: { IOS: boolean; isBrowser: boolean; ANDROID: boolean };
  let focusMonitor: FocusMonitor;

  beforeEach(
    waitForAsync(() => {
      // Set the default Platform override that can be updated before component creation.
      platform = { IOS: false, isBrowser: true, ANDROID: false };

      TestBed.configureTestingModule({
        imports: [SbbTooltipModule, OverlayModule, NoopAnimationsModule, SbbIconTestingModule],
        declarations: [
          BasicTooltipDemoComponent,
          ScrollableTooltipDemoComponent,
          OnPushTooltipDemoComponent,
          DynamicTooltipsDemoComponent,
          TooltipOnTextFieldsComponent,
          TooltipOnDraggableElementComponent,
          DataBoundAriaLabelTooltipComponent,
        ],
        providers: [
          { provide: Platform, useFactory: () => platform },
          {
            provide: Directionality,
            useFactory: () => {
              return (dir = { value: 'ltr' });
            },
          },
        ],
      });

      TestBed.compileComponents();

      inject([OverlayContainer, FocusMonitor], (oc: OverlayContainer, fm: FocusMonitor) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
        focusMonitor = fm;
      })();
    })
  );

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('basic usage', () => {
    let fixture: ComponentFixture<BasicTooltipDemoComponent>;
    let buttonDebugElement: DebugElement;
    let buttonElement: HTMLButtonElement;
    let tooltipDirective: SbbTooltip;

    beforeEach(() => {
      fixture = TestBed.createComponent(BasicTooltipDemoComponent);
      fixture.detectChanges();
      buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
      buttonElement = <HTMLButtonElement>buttonDebugElement.nativeElement;
      tooltipDirective = buttonDebugElement.injector.get<SbbTooltip>(SbbTooltip);
    });

    it('should show and hide the tooltip', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      fixture.detectChanges();

      // wait till animation has finished
      tick(500);

      // Make sure tooltip is shown to the user and animation has finished
      const tooltipElement = overlayContainerElement.querySelector(
        '.sbb-tooltip-content'
      ) as HTMLElement;
      expect(tooltipElement instanceof HTMLElement).toBe(true);
      expect(tooltipElement.style.transform).toBe('scale(1)');

      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);

      // After hide called, a timeout delay is created that will to hide the tooltip.
      const tooltipDelay = 1000;
      tooltipDirective.hide(tooltipDelay);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      // After the tooltip delay elapses, expect that the tooltip is not visible.
      tick(tooltipDelay);
      fixture.detectChanges();
      expect(tooltipDirective._isTooltipVisible()).toBe(false);

      // On animation complete, should expect that the tooltip has been detached.
      flushMicrotasks();
      assertTooltipInstance(tooltipDirective, false);
    }));

    it('should be able to re-open a tooltip if it was closed by detaching the overlay', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      fixture.detectChanges();
      tick(500);

      tooltipDirective._overlayRef!.detach();
      tick(0);
      fixture.detectChanges();
      expect(tooltipDirective._isTooltipVisible()).toBe(false);
      flushMicrotasks();
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
    }));

    it('should show with delay', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      const tooltipDelay = 1000;
      tooltipDirective.show(tooltipDelay);
      expect(tooltipDirective._isTooltipVisible()).toBe(false);

      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('');

      tick(tooltipDelay);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);
    }));

    it('should be able to override the default show and hide delays', fakeAsync(() => {
      TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [SbbTooltipModule, OverlayModule, NoopAnimationsModule],
          declarations: [BasicTooltipDemoComponent],
          providers: [
            {
              provide: SBB_TOOLTIP_DEFAULT_OPTIONS,
              useValue: { showDelay: 1337, hideDelay: 7331 },
            },
          ],
        })
        .compileComponents();

      fixture = TestBed.createComponent(BasicTooltipDemoComponent);
      fixture.detectChanges();
      tooltipDirective = fixture.debugElement
        .query(By.css('button'))!
        .injector.get<SbbTooltip>(SbbTooltip);

      tooltipDirective.show();
      fixture.detectChanges();
      tick();

      expect(tooltipDirective._isTooltipVisible()).toBe(false);
      tick(1337);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      tooltipDirective.hide();
      fixture.detectChanges();
      tick();

      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      tick(7331);
      expect(tooltipDirective._isTooltipVisible()).toBe(false);
    }));

    it('should set a css class on the overlay panel element', fakeAsync(() => {
      tooltipDirective.show();
      fixture.detectChanges();
      tick(0);

      const overlayRef = tooltipDirective._overlayRef;

      expect(!!overlayRef).toBeTruthy();
      expect(overlayRef!.overlayElement.classList).toContain(
        SBB_TOOLTIP_PANEL_CLASS,
        'Expected the overlay panel element to have the tooltip panel class set.'
      );
    }));

    it('should not show if disabled', fakeAsync(() => {
      // Test that disabling the tooltip will not set the tooltip visible
      tooltipDirective.disabled = true;
      tooltipDirective.show();
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(false);

      // Test to make sure setting disabled to false will show the tooltip
      // Sanity check to make sure everything was correct before (detectChanges, tick)
      tooltipDirective.disabled = false;
      tooltipDirective.show();
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
    }));

    it('should hide if disabled while visible', fakeAsync(() => {
      // Display the tooltip with a timeout before hiding.
      tooltipDirective.hideDelay = 1000;
      tooltipDirective.show();
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      // Set tooltip to be disabled and verify that the tooltip hides.
      tooltipDirective.disabled = true;
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(false);
    }));

    it('should hide if the message is cleared while the tooltip is open', fakeAsync(() => {
      tooltipDirective.show();
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      fixture.componentInstance.message = '';
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(false);
    }));

    it(
      'should not show if hide is called before delay finishes',
      waitForAsync(() => {
        assertTooltipInstance(tooltipDirective, false);

        const tooltipDelay = 1000;

        tooltipDirective.show(tooltipDelay);
        expect(tooltipDirective._isTooltipVisible()).toBe(false);

        fixture.detectChanges();
        expect(overlayContainerElement.textContent).toContain('');
        tooltipDirective.hide();

        fixture.whenStable().then(() => {
          expect(tooltipDirective._isTooltipVisible()).toBe(false);
        });
      })
    );

    it('should not show tooltip if message is not present or empty', () => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.message = undefined!;
      fixture.detectChanges();
      tooltipDirective.show();
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.message = null!;
      fixture.detectChanges();
      tooltipDirective.show();
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.message = '';
      fixture.detectChanges();
      tooltipDirective.show();
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.message = '   ';
      fixture.detectChanges();
      tooltipDirective.show();
      assertTooltipInstance(tooltipDirective, false);
    });

    it('should not follow through with hide if show is called after', fakeAsync(() => {
      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      // After hide called, a timeout delay is created that will to hide the tooltip.
      const tooltipDelay = 1000;
      tooltipDirective.hide(tooltipDelay);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      // Before delay time has passed, call show which should cancel intent to hide tooltip.
      tooltipDirective.show();
      tick(tooltipDelay);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
    }));

    it('should be able to modify the tooltip message', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      expect(tooltipDirective._tooltipInstance!._visibility).toBe('visible');

      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);

      const newMessage = 'new tooltip message';
      tooltipDirective.message = newMessage;

      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain(newMessage);
    }));

    it('should allow extra classes to be set on the tooltip', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      fixture.detectChanges();

      // Make sure classes aren't prematurely added
      let tooltipElement = overlayContainerElement.querySelector(
        '.sbb-tooltip-content'
      ) as HTMLElement;
      expect(tooltipElement.classList).not.toContain(
        'custom-one',
        'Expected to not have the class before enabling sbbTooltipClass'
      );
      expect(tooltipElement.classList).not.toContain(
        'custom-two',
        'Expected to not have the class before enabling sbbTooltipClass'
      );

      // Enable the classes via ngClass syntax
      fixture.componentInstance.showTooltipClass = true;
      fixture.detectChanges();

      // Make sure classes are correctly added
      tooltipElement = overlayContainerElement.querySelector('.sbb-tooltip-content') as HTMLElement;
      expect(tooltipElement.classList).toContain(
        'custom-one',
        'Expected to have the class after enabling sbbTooltipClass'
      );
      expect(tooltipElement.classList).toContain(
        'custom-two',
        'Expected to have the class after enabling sbbTooltipClass'
      );
    }));

    it('should be removed after parent destroyed', fakeAsync(() => {
      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      fixture.destroy();
      expect(overlayContainerElement.childNodes.length).toBe(0);
      expect(overlayContainerElement.textContent).toBe('');
    }));

    it('should have an aria-described element with the tooltip message', fakeAsync(() => {
      const dynamicTooltipsDemoFixture = TestBed.createComponent(DynamicTooltipsDemoComponent);
      const dynamicTooltipsComponent = dynamicTooltipsDemoFixture.componentInstance;

      dynamicTooltipsComponent.tooltips = ['Tooltip One', 'Tooltip Two'];
      dynamicTooltipsDemoFixture.detectChanges();
      tick();

      const buttons = dynamicTooltipsDemoFixture.nativeElement.querySelectorAll('button');
      const firstButtonAria = buttons[0].getAttribute('aria-describedby');
      expect(document.querySelector(`#${firstButtonAria}`)!.textContent).toBe('Tooltip One');

      const secondButtonAria = buttons[1].getAttribute('aria-describedby');
      expect(document.querySelector(`#${secondButtonAria}`)!.textContent).toBe('Tooltip Two');
    }));

    it(
      'should not add an ARIA description for elements that have the same text as a' +
        'data-bound aria-label',
      fakeAsync(() => {
        const ariaLabelFixture = TestBed.createComponent(DataBoundAriaLabelTooltipComponent);
        ariaLabelFixture.detectChanges();
        tick();

        const button = ariaLabelFixture.nativeElement.querySelector('button');
        expect(button.getAttribute('aria-describedby')).toBeFalsy();
      })
    );

    it('should not try to dispose the tooltip when destroyed and done hiding', fakeAsync(() => {
      tooltipDirective.show();
      fixture.detectChanges();
      tick(150);

      const tooltipDelay = 1000;
      tooltipDirective.hide();
      tick(tooltipDelay); // Change the tooltip state to hidden and trigger animation start

      // Store the tooltip instance, which will be set to null after the button is hidden.
      const tooltipInstance = tooltipDirective._tooltipInstance!;
      fixture.componentInstance.showButton = false;
      fixture.detectChanges();

      // At this point the animation should be able to complete itself and trigger the
      // _animationDone function, but for unknown reasons in the test infrastructure,
      // this does not occur. Manually call this and verify that doing so does not
      // throw an error.
      tooltipInstance._animationDone({
        fromState: 'visible',
        toState: 'hidden',
        totalTime: 150,
        phaseName: 'done',
      } as AnimationEvent);
    }));

    it('should complete the afterHidden stream when tooltip is destroyed', fakeAsync(() => {
      tooltipDirective.show();
      fixture.detectChanges();
      tick(150);

      const spy = jasmine.createSpy('complete spy');
      const subscription = tooltipDirective
        ._tooltipInstance!.afterHidden()
        .subscribe({ complete: spy });

      tooltipDirective.hide(0);
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    }));

    it('should pass the layout direction to the tooltip', fakeAsync(() => {
      dir.value = 'rtl';

      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();

      const tooltipWrapper = overlayContainerElement.querySelector(
        '.cdk-overlay-connected-position-bounding-box'
      )!;

      expect(tooltipWrapper).toBeTruthy('Expected tooltip to be shown.');
      expect(tooltipWrapper.getAttribute('dir')).toBe('rtl', 'Expected tooltip to be in RTL mode.');
    }));

    it('should keep the overlay direction in sync with the trigger direction', fakeAsync(() => {
      dir.value = 'rtl';
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();
      tick(500);

      let tooltipWrapper = overlayContainerElement.querySelector(
        '.cdk-overlay-connected-position-bounding-box'
      )!;
      expect(tooltipWrapper.getAttribute('dir')).toBe('rtl', 'Expected tooltip to be in RTL.');

      tooltipDirective.hide(0);
      tick(0);
      fixture.detectChanges();
      tick(500);

      dir.value = 'ltr';
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();
      tick(500);

      tooltipWrapper = overlayContainerElement.querySelector(
        '.cdk-overlay-connected-position-bounding-box'
      )!;
      expect(tooltipWrapper.getAttribute('dir')).toBe('ltr', 'Expected tooltip to be in LTR.');
    }));

    it('should be able to set the tooltip message as a number', fakeAsync(() => {
      fixture.componentInstance.message = 100;
      fixture.detectChanges();

      expect(tooltipDirective.message).toBe('100');
    }));

    it('should hide when clicking away', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);

      document.body.click();
      tick(0);
      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();

      expect(tooltipDirective._isTooltipVisible()).toBe(false);
      expect(overlayContainerElement.textContent).toBe('');
    }));

    it('should not hide immediately if a click fires while animating', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();

      document.body.click();
      fixture.detectChanges();
      tick(500);

      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);
    }));

    it('should not throw when pressing ESCAPE', fakeAsync(() => {
      expect(() => {
        dispatchKeyboardEvent(buttonElement, 'keydown', ESCAPE);
        fixture.detectChanges();
      }).not.toThrow();

      // Flush due to the additional tick that is necessary for the FocusMonitor.
      flush();
    }));

    it('should preventDefault when pressing ESCAPE', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();

      const event = dispatchKeyboardEvent(buttonElement, 'keydown', ESCAPE);
      fixture.detectChanges();
      flush();

      expect(event.defaultPrevented).toBe(true);
    }));

    it('should not preventDefault when pressing ESCAPE with a modifier', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();

      const event = dispatchKeyboardEvent(buttonElement, 'keydown', ESCAPE, undefined, {
        alt: true,
      });
      fixture.detectChanges();
      flush();

      expect(event.defaultPrevented).toBe(false);
    }));

    it('should not show the tooltip on progammatic focus', fakeAsync(() => {
      patchElementFocus(buttonElement);
      assertTooltipInstance(tooltipDirective, false);

      focusMonitor.focusVia(buttonElement, 'program');
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(overlayContainerElement.querySelector('.sbb-tooltip-content')).toBeNull();
    }));

    it('should not show the tooltip on mouse focus', fakeAsync(() => {
      patchElementFocus(buttonElement);
      assertTooltipInstance(tooltipDirective, false);

      focusMonitor.focusVia(buttonElement, 'mouse');
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(overlayContainerElement.querySelector('.sbb-tooltip-content')).toBeNull();
    }));

    it('should not show the tooltip on touch focus', fakeAsync(() => {
      patchElementFocus(buttonElement);
      assertTooltipInstance(tooltipDirective, false);

      focusMonitor.focusVia(buttonElement, 'touch');
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(overlayContainerElement.querySelector('.sbb-tooltip-content')).toBeNull();
    }));

    it('should not hide the tooltip when calling `show` twice in a row', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      fixture.detectChanges();
      tick(500);

      const overlayRef = tooltipDirective._overlayRef!;

      spyOn(overlayRef, 'detach').and.callThrough();

      tooltipDirective.show();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      fixture.detectChanges();
      tick(500);

      expect(overlayRef.detach).not.toHaveBeenCalled();
    }));

    it('should apply css class content below or above to container component', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const tooltipContainerComponent = fixture.debugElement.query(
        By.css('.sbb-tooltip-content')
      ).nativeElement;
      expect(tooltipContainerComponent).toBeTruthy();
      expect(
        tooltipContainerComponent.classList.contains('sbb-tooltip-content-below') ||
          tooltipContainerComponent.classList.contains('sbb-tooltip-content-above')
      ).toBeTruthy();
    }));
  });

  describe('scrollable usage', () => {
    let fixture: ComponentFixture<ScrollableTooltipDemoComponent>;
    let buttonDebugElement: DebugElement;
    let tooltipDirective: SbbTooltip;

    beforeEach(() => {
      fixture = TestBed.createComponent(ScrollableTooltipDemoComponent);
      fixture.detectChanges();
      buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
      tooltipDirective = buttonDebugElement.injector.get<SbbTooltip>(SbbTooltip);
    });

    it('should hide tooltip if clipped after changing positions', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      // Show the tooltip and tick for the show delay (default is 0)
      tooltipDirective.show();
      fixture.detectChanges();
      tick(0);

      // Expect that the tooltip is displayed
      expect(tooltipDirective._isTooltipVisible()).toBe(
        true,
        'Expected tooltip to be initially visible'
      );
    }));

    it('should execute the `hide` call, after scrolling away, inside the NgZone', fakeAsync(() => {
      const inZoneSpy = jasmine.createSpy('in zone spy');

      tooltipDirective.show();
      fixture.detectChanges();
      tick(0);

      spyOn(tooltipDirective._tooltipInstance!, 'hide').and.callFake(() => {
        inZoneSpy(NgZone.isInAngularZone());
      });

      fixture.componentInstance.scrollDown();
      tick(100);
      fixture.detectChanges();

      expect(inZoneSpy).toHaveBeenCalled();
      expect(inZoneSpy).toHaveBeenCalledWith(true);
    }));
  });

  describe('with OnPush', () => {
    let fixture: ComponentFixture<OnPushTooltipDemoComponent>;
    let buttonDebugElement: DebugElement;
    let buttonElement: HTMLButtonElement;
    let tooltipDirective: SbbTooltip;

    beforeEach(() => {
      fixture = TestBed.createComponent(OnPushTooltipDemoComponent);
      fixture.detectChanges();
      buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
      buttonElement = <HTMLButtonElement>buttonDebugElement.nativeElement;
      tooltipDirective = buttonDebugElement.injector.get<SbbTooltip>(SbbTooltip);
    });

    it('should show and hide the tooltip', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      fixture.detectChanges();

      // wait until animation has finished
      tick(500);

      // Make sure tooltip is shown to the user and animation has finished
      const tooltipElement = overlayContainerElement.querySelector(
        '.sbb-tooltip-content'
      ) as HTMLElement;
      expect(tooltipElement instanceof HTMLElement).toBe(true);
      expect(tooltipElement.style.transform).toBe('scale(1)');

      // After hide called, a timeout delay is created that will to hide the tooltip.
      const tooltipDelay = 1000;
      tooltipDirective.hide(tooltipDelay);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      // After the tooltip delay elapses, expect that the tooltip is not visible.
      tick(tooltipDelay);
      fixture.detectChanges();
      expect(tooltipDirective._isTooltipVisible()).toBe(false);

      // On animation complete, should expect that the tooltip has been detached.
      flushMicrotasks();
      assertTooltipInstance(tooltipDirective, false);
    }));

    it('should have rendered the tooltip text on init', fakeAsync(() => {
      dispatchFakeEvent(buttonElement, 'mouseenter');
      fixture.detectChanges();
      tick(0);

      const tooltipElement = overlayContainerElement.querySelector(
        '.sbb-tooltip-content'
      ) as HTMLElement;
      expect(tooltipElement.textContent).toContain('initial tooltip message');
    }));
  });

  describe('touch gestures', () => {
    beforeEach(() => {
      platform.ANDROID = true;
    });

    it('should have a delay when showing on touchstart', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTooltipDemoComponent);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();
      tick(250); // Halfway through the delay.

      assertTooltipInstance(fixture.componentInstance.tooltip, false);

      tick(250); // Finish the delay.
      fixture.detectChanges();
      tick(500); // Finish the animation.

      assertTooltipInstance(fixture.componentInstance.tooltip, true);
    }));

    it('should not prevent the default action on touchstart', () => {
      const fixture = TestBed.createComponent(BasicTooltipDemoComponent);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      const event = dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
    });

    it('should close on touchend with a delay', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTooltipDemoComponent);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();
      tick(500); // Finish the open delay.
      fixture.detectChanges();
      tick(500); // Finish the animation.
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      dispatchFakeEvent(button, 'touchend');
      fixture.detectChanges();
      tick(1000); // 2/3 through the delay
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      tick(500); // Finish the delay.
      fixture.detectChanges();
      tick(500); // Finish the exit animation.

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
    }));

    it('should close on touchcancel with a delay', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTooltipDemoComponent);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();
      tick(500); // Finish the open delay.
      fixture.detectChanges();
      tick(500); // Finish the animation.
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      dispatchFakeEvent(button, 'touchcancel');
      fixture.detectChanges();
      tick(1000); // 2/3 through the delay
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      tick(500); // Finish the delay.
      fixture.detectChanges();
      tick(500); // Finish the exit animation.

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
    }));

    it('should disable native touch interactions', () => {
      const fixture = TestBed.createComponent(BasicTooltipDemoComponent);
      fixture.detectChanges();

      const styles = fixture.nativeElement.querySelector('button').style;
      expect(styles.touchAction || (styles as any).webkitUserDrag).toBe('none');
    });

    it('should allow text selection on inputs when gestures are set to auto', () => {
      const fixture = TestBed.createComponent(TooltipOnTextFieldsComponent);
      fixture.detectChanges();

      const inputStyle = fixture.componentInstance.input.nativeElement.style;
      const textareaStyle = fixture.componentInstance.textarea.nativeElement.style;

      expect(inputStyle.userSelect).toBeFalsy();
      expect(inputStyle.webkitUserSelect).toBeFalsy();
      expect((inputStyle as any).msUserSelect).toBeFalsy();
      expect((inputStyle as any).MozUserSelect).toBeFalsy();

      expect(textareaStyle.userSelect).toBeFalsy();
      expect(textareaStyle.webkitUserSelect).toBeFalsy();
      expect((textareaStyle as any).msUserSelect).toBeFalsy();
      expect((textareaStyle as any).MozUserSelect).toBeFalsy();
    });

    it('should allow native dragging on draggable elements when gestures are set to auto', () => {
      const fixture = TestBed.createComponent(TooltipOnDraggableElementComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.button.nativeElement.style.webkitUserDrag).toBeFalsy();
    });

    it('should not open on `mouseenter` on iOS', () => {
      platform.IOS = true;
      platform.ANDROID = false;

      const fixture = TestBed.createComponent(BasicTooltipDemoComponent);

      fixture.detectChanges();
      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseenter');
      fixture.detectChanges();

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
    });

    it('should not open on `mouseenter` on Android', () => {
      platform.ANDROID = true;
      platform.IOS = false;

      const fixture = TestBed.createComponent(BasicTooltipDemoComponent);

      fixture.detectChanges();
      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseenter');
      fixture.detectChanges();

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
    });
  });
});

@Component({
  selector: 'sbb-app',
  template: `
    <button
      #button
      *ngIf="showButton"
      [sbbTooltip]="message"
      [sbbTooltipClass]="{ 'custom-one': showTooltipClass, 'custom-two': showTooltipClass }"
    >
      Button
    </button>
  `,
})
class BasicTooltipDemoComponent {
  message: any = initialTooltipMessage;
  showButton: boolean = true;
  showTooltipClass = false;
  @ViewChild(SbbTooltip) tooltip: SbbTooltip;
  @ViewChild('button') button: ElementRef<HTMLButtonElement>;
}

@Component({
  selector: 'sbb-app',
  template: `
    <div
      cdkScrollable
      style="padding: 100px; margin: 300px;
                               height: 200px; width: 200px; overflow: auto;"
    >
      <button *ngIf="showButton" style="margin-bottom: 600px" [sbbTooltip]="message">Button</button>
    </div>
  `,
})
class ScrollableTooltipDemoComponent {
  message: string = initialTooltipMessage;
  showButton: boolean = true;

  @ViewChild(CdkScrollable) scrollingContainer: CdkScrollable;

  scrollDown() {
    const scrollingContainerEl = this.scrollingContainer.getElementRef().nativeElement;
    scrollingContainerEl.scrollTop = 250;

    // Emit a scroll event from the scrolling element in our component.
    // This event should be picked up by the scrollable directive and notify.
    // The notification should be picked up by the service.
    dispatchFakeEvent(scrollingContainerEl, 'scroll');
  }
}

@Component({
  selector: 'sbb-app',
  template: ` <button [sbbTooltip]="message">Button</button> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushTooltipDemoComponent {
  message: string = initialTooltipMessage;
}

@Component({
  selector: 'sbb-app',
  template: `
    <button *ngFor="let tooltip of tooltips" [sbbTooltip]="tooltip">Button {{ tooltip }}</button>
  `,
})
class DynamicTooltipsDemoComponent {
  tooltips: Array<string> = [];
}

@Component({
  template: ` <button [sbbTooltip]="message" [attr.aria-label]="message">Click me</button> `,
})
class DataBoundAriaLabelTooltipComponent {
  message = 'Hello there';
}

@Component({
  template: `
    <input #input sbbTooltip="Something" />

    <textarea #textarea sbbTooltip="Another thing"></textarea>
  `,
})
class TooltipOnTextFieldsComponent {
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement>;
}

@Component({
  template: ` <button #button draggable="true" sbbTooltip="Drag me"></button> `,
})
class TooltipOnDraggableElementComponent {
  @ViewChild('button') button: ElementRef;
}

/** Asserts whether a tooltip directive has a tooltip instance. */
function assertTooltipInstance(tooltip: SbbTooltip, shouldExist: boolean): void {
  // Note that we have to cast this to a boolean, because Jasmine will go into an infinite loop
  // if it tries to stringify the `_tooltipInstance` when an assertion fails. The infinite loop
  // happens due to the `_tooltipInstance` having a circular structure.
  expect(!!tooltip._tooltipInstance).toBe(shouldExist);
}

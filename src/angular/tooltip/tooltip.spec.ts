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
  EventEmitter,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  createFakeEvent,
  createKeyboardEvent,
  createMouseEvent,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  patchElementFocus,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { skip } from 'rxjs/operators';

import {
  SbbTooltip,
  SbbTooltipChangeEvent,
  SbbTooltipModule,
  SBB_TOOLTIP_DEFAULT_OPTIONS,
  SCROLL_THROTTLE_MS,
  TooltipPosition,
  TooltipTouchGestures,
} from './index';

const initialTooltipMessage = 'initial tooltip message';

// tslint:disable-next-line:no-undecorated-class-with-angular-features lifecycle-hook-interface
class FakeDirectionality implements Directionality {
  readonly change: EventEmitter<Direction>;

  get value(): Direction {
    return this.valueSignal();
  }

  constructor(readonly valueSignal: WritableSignal<Direction>) {
    this.change = toObservable(valueSignal).pipe(skip(1)) as EventEmitter<Direction>;
  }

  ngOnDestroy() {}
}

describe('SbbTooltip', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let dir: WritableSignal<Direction>;
  let platform: Platform;
  let focusMonitor: FocusMonitor;

  beforeEach(waitForAsync(() => {
    dir = signal('ltr');
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule],
      providers: [
        {
          provide: Directionality,
          useFactory: () => new FakeDirectionality(dir),
          deps: [],
        },
      ],
    });

    inject(
      [OverlayContainer, FocusMonitor, Platform],
      (oc: OverlayContainer, fm: FocusMonitor, pl: Platform) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
        focusMonitor = fm;
        platform = pl;
      },
    )();
  }));

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('basic usage', () => {
    let fixture: ComponentFixture<BasicTooltipDemo>;
    let buttonDebugElement: DebugElement;
    let buttonElement: HTMLButtonElement;
    let tooltipDirective: SbbTooltip;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.detectChanges();
      tick();
      buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
      buttonElement = buttonDebugElement.nativeElement;
      tooltipDirective = buttonDebugElement.injector.get<SbbTooltip>(SbbTooltip);
    }));

    it('should show and hide the tooltip', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      fixture.detectChanges();

      // Wait until animation has finished.
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      // Make sure tooltip is shown to the user and animation has finished.
      const tooltipElement = overlayContainerElement.querySelector(
        '.sbb-tooltip-container',
      ) as HTMLElement;
      expect(tooltipElement instanceof HTMLElement).toBe(true);
      expect(tooltipElement.classList).toContain('sbb-tooltip-container-show');

      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);

      // After hide is called, a timeout delay is created that will to hide the tooltip.
      const tooltipDelay = 1000;
      tooltipDirective.hide(tooltipDelay);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      // After the tooltip delay elapses, expect that the tooltip is not visible.
      tick(tooltipDelay);
      fixture.detectChanges();
      expect(tooltipDirective._isTooltipVisible()).toBe(false);

      // On animation complete, should expect that the tooltip has been detached.
      finishCurrentTooltipAnimation(overlayContainerElement, false);
      assertTooltipInstance(tooltipDirective, false);
      flush();
    }));

    it('should be able to re-open a tooltip if it was closed by detaching the overlay', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      tooltipDirective._overlayRef!.detach();
      tick(0);
      fixture.detectChanges();
      expect(tooltipDirective._isTooltipVisible()).toBe(false);
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0);
      finishCurrentTooltipAnimation(overlayContainerElement, true);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      flush();
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
      TestBed.resetTestingModule().configureTestingModule({
        providers: [
          {
            provide: SBB_TOOLTIP_DEFAULT_OPTIONS,
            useValue: { showDelay: 1337, hideDelay: 7331 },
          },
        ],
      });

      fixture = TestBed.createComponent(BasicTooltipDemo);
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
      flush();
    }));

    it('should be able to override the default position', fakeAsync(() => {
      TestBed.resetTestingModule().configureTestingModule({
        imports: [SbbTooltipModule, OverlayModule],
        declarations: [TooltipDemoWithoutPositionBinding],
        providers: [
          {
            provide: SBB_TOOLTIP_DEFAULT_OPTIONS,
            useValue: { position: 'right' },
          },
        ],
      });

      const newFixture = TestBed.createComponent(TooltipDemoWithoutPositionBinding);
      newFixture.detectChanges();
      tooltipDirective = newFixture.debugElement
        .query(By.css('button'))!
        .injector.get<SbbTooltip>(SbbTooltip);

      tooltipDirective.show();
      newFixture.detectChanges();
      tick();

      expect(tooltipDirective.position).toBe('right');
      expect(tooltipDirective._getOverlayPositions()[0].overlayX).toBe('start');
      expect(tooltipDirective._getOverlayPositions()[0].overlayY).toBe('center');
    }));

    it('should be able to disable tooltip interactivity', fakeAsync(() => {
      TestBed.resetTestingModule().configureTestingModule({
        imports: [SbbTooltipModule],
        declarations: [TooltipDemoWithoutPositionBinding],
        providers: [
          {
            provide: SBB_TOOLTIP_DEFAULT_OPTIONS,
            useValue: { disableTooltipInteractivity: true },
          },
        ],
      });

      const newFixture = TestBed.createComponent(TooltipDemoWithoutPositionBinding);
      newFixture.detectChanges();
      tooltipDirective = newFixture.debugElement
        .query(By.css('button'))!
        .injector.get<SbbTooltip>(SbbTooltip);

      tooltipDirective.show();
      newFixture.detectChanges();
      tick();

      expect(tooltipDirective._overlayRef?.overlayElement.classList).toContain(
        'sbb-tooltip-panel-non-interactive',
      );
    }));

    it('should set a css class on the overlay panel element', fakeAsync(() => {
      tooltipDirective.show();
      fixture.detectChanges();
      tick(0);

      const overlayRef = tooltipDirective._overlayRef;

      expect(!!overlayRef).toBeTruthy();
      expect(overlayRef!.overlayElement.classList)
        .withContext('Expected the overlay panel element to have the tooltip panel class set.')
        .toContain('sbb-tooltip-panel');
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
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(false);
      flush();
    }));

    it('should not show if hide is called before delay finishes', waitForAsync(() => {
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
    }));

    it('should not show tooltip if message is not present or empty', () => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.message = undefined!;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tooltipDirective.show();
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.message = null!;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tooltipDirective.show();
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.message = '';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tooltipDirective.show();
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.message = '   ';
      fixture.changeDetectorRef.markForCheck();
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

    it('should be able to update the tooltip position while open', fakeAsync(() => {
      tooltipDirective.position = 'below';
      tooltipDirective.show();
      tick();

      assertTooltipInstance(tooltipDirective, true);

      spyOn(tooltipDirective._overlayRef!, 'updatePosition').and.callThrough();
      tooltipDirective.position = 'above';
      fixture.detectChanges();
      tick();

      assertTooltipInstance(tooltipDirective, true);
      expect(tooltipDirective._overlayRef!.updatePosition).toHaveBeenCalled();
    }));

    it('should not throw when updating the position for a closed tooltip', fakeAsync(() => {
      tooltipDirective.position = 'left';
      tooltipDirective.show(0);
      fixture.detectChanges();
      tick();

      tooltipDirective.hide(0);
      fixture.detectChanges();
      tick();
      finishCurrentTooltipAnimation(overlayContainerElement, false);

      expect(() => {
        tooltipDirective.position = 'right';
        fixture.detectChanges();
        tick();
      }).not.toThrow();
    }));

    it('should be able to modify the tooltip message', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      expect(tooltipDirective._tooltipInstance!.isVisible()).toBe(true);

      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);

      const newMessage = 'new tooltip message';
      tooltipDirective.message = newMessage;

      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain(newMessage);
    }));

    it('should allow extra classes to be set on the tooltip', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      fixture.detectChanges();

      // Make sure classes aren't prematurely added
      let tooltipElement = overlayContainerElement.querySelector('.sbb-tooltip') as HTMLElement;
      expect(tooltipElement.classList).not.toContain(
        'custom-one',
        'Expected to not have the class before enabling sbbTooltipClass',
      );
      expect(tooltipElement.classList).not.toContain(
        'custom-two',
        'Expected to not have the class before enabling sbbTooltipClass',
      );

      // Enable the classes via ngClass syntax
      fixture.componentInstance.showTooltipClass = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      // Make sure classes are correctly added
      tooltipElement = overlayContainerElement.querySelector('.sbb-tooltip') as HTMLElement;
      expect(tooltipElement.classList)
        .withContext('Expected to have the class after enabling sbbTooltipClass')
        .toContain('custom-one');
      expect(tooltipElement.classList)
        .withContext('Expected to have the class after enabling sbbTooltipClass')
        .toContain('custom-two');
    }));

    it('should allow extra classes to be set on the tooltip panel', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      fixture.detectChanges();

      // Make sure classes are correctly added
      const tooltipElement = overlayContainerElement.querySelector(
        '.sbb-tooltip-panel',
      ) as HTMLElement;
      expect(tooltipElement.classList).toContain('custom-panel-one');
      expect(tooltipElement.classList).toContain('custom-panel-two');
    }));

    it('should be removed after parent destroyed', fakeAsync(() => {
      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      fixture.destroy();
      expect(overlayContainerElement.childNodes.length).toBe(0);
      expect(overlayContainerElement.textContent).toBe('');
      flush();
    }));

    it('should have an aria-describedby element with the tooltip message', fakeAsync(() => {
      const dynamicTooltipsDemoFixture = TestBed.createComponent(DynamicTooltipsDemo);
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

    it('should not add an ARIA description for elements that have the same text as a data-bound aria-label', fakeAsync(() => {
      const ariaLabelFixture = TestBed.createComponent(DataBoundAriaLabelTooltip);
      ariaLabelFixture.detectChanges();
      tick();

      const button = ariaLabelFixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-describedby')).toBeFalsy();
    }));

    it('should toggle aria-describedby depending on whether the tooltip is disabled', fakeAsync(() => {
      expect(buttonElement.getAttribute('aria-describedby')).toBeTruthy();

      fixture.componentInstance.tooltipDisabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();
      expect(buttonElement.hasAttribute('aria-describedby')).toBe(false);

      fixture.componentInstance.tooltipDisabled = false;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();
      expect(buttonElement.getAttribute('aria-describedby')).toBeTruthy();
    }));

    it('should not try to dispose the tooltip when destroyed and done hiding', fakeAsync(() => {
      tooltipDirective.show();
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      const tooltipDelay = 1000;
      tooltipDirective.hide();
      tick(tooltipDelay); // Change the tooltip state to hidden and trigger animation start

      fixture.componentInstance.showButton = false;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
    }));

    it('should complete the afterHidden stream when tooltip is destroyed', fakeAsync(() => {
      tooltipDirective.show();
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      const spy = jasmine.createSpy('complete spy');
      const subscription = tooltipDirective
        ._tooltipInstance!.afterHidden()
        .subscribe({ complete: spy });

      tooltipDirective.hide(0);
      tick(0);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    }));

    it('should pass the layout direction to the tooltip', fakeAsync(() => {
      dir.set('rtl');
      fixture.detectChanges();

      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();

      const tooltipWrapper = overlayContainerElement.querySelector(
        '.cdk-overlay-connected-position-bounding-box',
      )!;

      expect(tooltipWrapper).withContext('Expected tooltip to be shown.').toBeTruthy();
      expect(tooltipWrapper.getAttribute('dir'))
        .withContext('Expected tooltip to be in RTL mode.')
        .toBe('rtl');
    }));

    it('should throw when trying to assign an invalid position', () => {
      expect(() => {
        fixture.componentInstance.position = 'everywhere';
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        tooltipDirective.show();
      }).toThrowError('Tooltip position "everywhere" is invalid.');
    });

    it('should be able to set the tooltip message as a number', fakeAsync(() => {
      fixture.componentInstance.message = 100;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(tooltipDirective.message).toBe('100');
    }));

    it('should hide when clicking away', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);

      document.body.click();
      tick(0);
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false);
      fixture.detectChanges();

      expect(tooltipDirective._isTooltipVisible()).toBe(false);
      expect(overlayContainerElement.textContent).toBe('');
    }));

    it('should hide when clicking away with an auxilliary button', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);

      dispatchFakeEvent(document.body, 'auxclick');
      tick(0);
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false);
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
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);
      flush();
    }));

    it('should hide when pressing escape', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      expect(overlayContainerElement.textContent).toContain(initialTooltipMessage);

      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      tick(0);
      fixture.detectChanges();
      tick(500);
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false);

      expect(tooltipDirective._isTooltipVisible()).toBe(false);
      expect(overlayContainerElement.textContent).toBe('');
      flush();
    }));

    it('should not throw when pressing ESCAPE', fakeAsync(() => {
      expect(() => {
        dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
        fixture.detectChanges();
      }).not.toThrow();

      // Flush due to the additional tick that is necessary for the FocusMonitor.
      flush();
    }));

    it('should preventDefault when pressing ESCAPE', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();

      const event = dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      fixture.detectChanges();
      flush();

      expect(event.defaultPrevented).toBe(true);
    }));

    it('should not preventDefault when pressing ESCAPE with a modifier', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();

      const event = createKeyboardEvent('keydown', ESCAPE, undefined, { alt: true });
      dispatchEvent(document.body, event);
      fixture.detectChanges();
      flush();

      expect(event.defaultPrevented).toBe(false);
    }));

    it('should not show the tooltip on programmatic focus', fakeAsync(() => {
      patchElementFocus(buttonElement);
      assertTooltipInstance(tooltipDirective, false);

      focusMonitor.focusVia(buttonElement, 'program');
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(overlayContainerElement.querySelector('.sbb-tooltip')).toBeNull();
    }));

    it('should not show the tooltip on mouse focus', fakeAsync(() => {
      patchElementFocus(buttonElement);
      assertTooltipInstance(tooltipDirective, false);

      focusMonitor.focusVia(buttonElement, 'mouse');
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(overlayContainerElement.querySelector('.sbb-tooltip')).toBeNull();
    }));

    it('should not show the tooltip on touch focus', fakeAsync(() => {
      patchElementFocus(buttonElement);
      assertTooltipInstance(tooltipDirective, false);

      focusMonitor.focusVia(buttonElement, 'touch');
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(overlayContainerElement.querySelector('.sbb-tooltip')).toBeNull();
    }));

    it('should not hide the tooltip when calling `show` twice in a row', fakeAsync(() => {
      tooltipDirective.show();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      const overlayRef = tooltipDirective._overlayRef!;

      spyOn(overlayRef, 'detach').and.callThrough();

      tooltipDirective.show();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      expect(overlayRef.detach).not.toHaveBeenCalled();
      flush();
    }));

    it('should set a class on the overlay panel that reflects the position', fakeAsync(() => {
      // Move the element so that the primary position is always used.
      buttonElement.style.position = 'fixed';
      buttonElement.style.top = buttonElement.style.left = '200px';

      fixture.componentInstance.message = 'hi';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      setPositionAndShow('below');

      const classList = tooltipDirective._overlayRef!.overlayElement.classList;
      expect(classList).toContain('sbb-tooltip-panel-below');

      setPositionAndShow('above');
      expect(classList).not.toContain('sbb-tooltip-panel-below');
      expect(classList).toContain('sbb-tooltip-panel-above');

      setPositionAndShow('left');
      expect(classList).not.toContain('sbb-tooltip-panel-above');
      expect(classList).toContain('sbb-tooltip-panel-left');

      setPositionAndShow('right');
      expect(classList).not.toContain('sbb-tooltip-panel-left');
      expect(classList).toContain('sbb-tooltip-panel-right');

      function setPositionAndShow(position: TooltipPosition) {
        tooltipDirective.hide(0);
        fixture.detectChanges();
        tick(0);
        tooltipDirective.position = position;
        tooltipDirective.show(0);
        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        tick(500);
      }
    }));

    it('should clear the show timeout on destroy', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show(1000);
      fixture.detectChanges();

      // Note that we aren't asserting anything, but `fakeAsync` will
      // throw if we have any timers by the end of the test.
      fixture.destroy();
      flush();
    }));

    it('should clear the hide timeout on destroy', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();
      tick(500);

      tooltipDirective.hide(1000);
      fixture.detectChanges();

      // Note that we aren't asserting anything, but `fakeAsync` will
      // throw if we have any timers by the end of the test.
      fixture.destroy();
      flush();
    }));

    it('should hide on mouseleave on the trigger', fakeAsync(() => {
      // We don't bind mouse events on mobile devices.
      if (platform.IOS || platform.ANDROID) {
        return;
      }

      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseenter');
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseleave');
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(false);
    }));

    it('should not hide on mouseleave if the pointer goes from the trigger to the tooltip', fakeAsync(() => {
      // We don't bind mouse events on mobile devices.
      if (platform.IOS || platform.ANDROID) {
        return;
      }

      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseenter');
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      const tooltipElement = overlayContainerElement.querySelector('.sbb-tooltip') as HTMLElement;
      const event = createMouseEvent('mouseleave');
      Object.defineProperty(event, 'relatedTarget', { value: tooltipElement });

      dispatchEvent(fixture.componentInstance.button.nativeElement, event);
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
    }));

    it('should hide on mouseleave on the tooltip', fakeAsync(() => {
      // We don't bind mouse events on mobile devices.
      if (platform.IOS || platform.ANDROID) {
        return;
      }

      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseenter');
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      const tooltipElement = overlayContainerElement.querySelector('.sbb-tooltip') as HTMLElement;
      dispatchMouseEvent(tooltipElement, 'mouseleave');
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(false);
    }));

    it('should not hide on mouseleave if the pointer goes from the tooltip to the trigger', fakeAsync(() => {
      // We don't bind mouse events on mobile devices.
      if (platform.IOS || platform.ANDROID) {
        return;
      }

      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseenter');
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      const tooltipElement = overlayContainerElement.querySelector('.sbb-tooltip') as HTMLElement;
      const event = createMouseEvent('mouseleave');
      Object.defineProperty(event, 'relatedTarget', {
        value: fixture.componentInstance.button.nativeElement,
      });

      dispatchEvent(tooltipElement, event);
      fixture.detectChanges();
      tick(0);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);
    }));

    it('should emit event on showing tooltip', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      let event: SbbTooltipChangeEvent | null = null;
      tooltipDirective.opened.subscribe((e) => (event = e));

      tooltipDirective.show();
      tick(0);
      fixture.detectChanges();
      tick(500);

      expect(event!.instance).toBe(tooltipDirective);

      // Note that we aren't asserting anything, but `fakeAsync` will
      // throw if we have any timers by the end of the test.
      fixture.destroy();
      flush();
    }));

    it('should emit event on dismissing tooltip', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      let event: SbbTooltipChangeEvent | null = null;
      tooltipDirective.dismissed.subscribe((e) => (event = e));

      tooltipDirective.show();
      tick(0); // Tick for the show delay (default is 0)
      fixture.detectChanges();
      // After hide called, a timeout delay is created that will to hide the tooltip.
      tooltipDirective.hide();
      tick(0);
      finishCurrentTooltipAnimation(overlayContainerElement, false);
      fixture.detectChanges();

      expect(event!.instance).toBe(tooltipDirective);
    }));
  });

  describe('scrollable usage', () => {
    let fixture: ComponentFixture<ScrollableTooltipDemo>;
    let buttonDebugElement: DebugElement;
    let tooltipDirective: SbbTooltip;

    beforeEach(() => {
      fixture = TestBed.createComponent(ScrollableTooltipDemo);
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
      expect(tooltipDirective._isTooltipVisible())
        .withContext('Expected tooltip to be initially visible')
        .toBe(true);

      // Scroll the page but tick just before the default throttle should update.
      fixture.componentInstance.scrollDown();
      tick(SCROLL_THROTTLE_MS - 1);
      expect(tooltipDirective._isTooltipVisible())
        .withContext('Expected tooltip to be visible when scrolling, before throttle limit')
        .toBe(true);

      // Finish ticking to the throttle's limit and check that the scroll event notified the
      // tooltip and it was hidden.
      tick(100);
      fixture.detectChanges();
      expect(tooltipDirective._isTooltipVisible())
        .withContext('Expected tooltip hidden when scrolled out of view, after throttle limit')
        .toBe(false);
    }));
  });

  describe('with OnPush', () => {
    let fixture: ComponentFixture<OnPushTooltipDemo>;
    let buttonDebugElement: DebugElement;
    let buttonElement: HTMLButtonElement;
    let tooltipDirective: SbbTooltip;

    beforeEach(() => {
      fixture = TestBed.createComponent(OnPushTooltipDemo);
      fixture.detectChanges();
      buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
      buttonElement = <HTMLButtonElement>buttonDebugElement.nativeElement;
      tooltipDirective = buttonDebugElement.injector.get<SbbTooltip>(SbbTooltip);
    });

    it('should show and hide the tooltip', fakeAsync(() => {
      assertTooltipInstance(tooltipDirective, false);

      tooltipDirective.show();
      tick(500); // Tick for the show delay (default is 0)
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      fixture.detectChanges();

      // Wait until animation has finished
      finishCurrentTooltipAnimation(overlayContainerElement, true);

      // Make sure tooltip is shown to the user and animation has finished
      const tooltipContainer = overlayContainerElement.querySelector(
        '.sbb-tooltip-container',
      ) as HTMLElement;
      expect(tooltipContainer instanceof HTMLElement).toBe(true);
      expect(tooltipContainer.classList).toContain('sbb-tooltip-container-show');

      // After hide called, a timeout delay is created that will to hide the tooltip.
      const tooltipDelay = 1000;
      tooltipDirective.hide(tooltipDelay);
      expect(tooltipDirective._isTooltipVisible()).toBe(true);

      // After the tooltip delay elapses, expect that the tooltip is not visible.
      tick(tooltipDelay);
      fixture.detectChanges();
      expect(tooltipDirective._isTooltipVisible()).toBe(false);

      // On animation complete, should expect that the tooltip has been detached.
      finishCurrentTooltipAnimation(overlayContainerElement, false);
      assertTooltipInstance(tooltipDirective, false);
      flush();
    }));

    it('should have rendered the tooltip text on init', fakeAsync(() => {
      // We don't bind mouse events on mobile devices.
      if (platform.IOS || platform.ANDROID) {
        return;
      }

      dispatchFakeEvent(buttonElement, 'mouseenter');
      fixture.detectChanges();
      tick(0);

      const tooltipElement = overlayContainerElement.querySelector('.sbb-tooltip') as HTMLElement;
      expect(tooltipElement.textContent).toContain('initial tooltip message');
    }));
  });

  describe('touch gestures', () => {
    beforeEach(() => {
      platform.ANDROID = true;
    });

    it('should have a delay when showing on touchstart', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();
      tick(250); // Halfway through the delay.

      assertTooltipInstance(fixture.componentInstance.tooltip, false);

      tick(500); // Finish the delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true); // Finish the animation.

      assertTooltipInstance(fixture.componentInstance.tooltip, true);
      flush();
    }));

    it('should be able to disable opening on touch', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.componentInstance.touchGestures = 'off';
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();
      tick(500); // Finish the delay.
      fixture.detectChanges();
      tick(500); // Finish the animation.

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
    }));

    it('should not prevent the default action on touchstart', () => {
      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      const event = dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
    });

    it('should close on touchend with a delay', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();
      tick(500); // Finish the open delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true); // Finish the animation.
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      dispatchFakeEvent(button, 'touchend');
      fixture.detectChanges();
      tick(1000); // 2/3 through the delay
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      tick(500); // Finish the delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false); // Finish the exit animation.

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
      flush();
    }));

    it('should close on touchcancel with a delay', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'touchstart');
      fixture.detectChanges();
      tick(500); // Finish the open delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true); // Finish the animation.
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      dispatchFakeEvent(button, 'touchcancel');
      fixture.detectChanges();
      tick(1000); // 2/3 through the delay
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      tick(500); // Finish the delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false); // Finish the exit animation.

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
      flush();
    }));

    it('should disable native touch interactions', () => {
      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.detectChanges();

      const styles = fixture.nativeElement.querySelector('button').style;
      expect(styles.touchAction || (styles as any).webkitUserDrag).toBe('none');
    });

    it('should allow native touch interactions if touch gestures are turned off', () => {
      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.componentInstance.touchGestures = 'off';
      fixture.detectChanges();

      const styles = fixture.nativeElement.querySelector('button').style;
      expect(styles.touchAction || (styles as any).webkitUserDrag).toBeFalsy();
    });

    it('should allow text selection on inputs when gestures are set to auto', () => {
      const fixture = TestBed.createComponent(TooltipOnTextFields);
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

    it('should disable text selection on inputs when gestures are set to on', () => {
      const fixture = TestBed.createComponent(TooltipOnTextFields);
      fixture.componentInstance.touchGestures = 'on';
      fixture.detectChanges();

      const inputStyle = fixture.componentInstance.input.nativeElement.style;
      const inputUserSelect =
        inputStyle.userSelect ||
        inputStyle.webkitUserSelect ||
        (inputStyle as any).msUserSelect ||
        (inputStyle as any).MozUserSelect;
      const textareaStyle = fixture.componentInstance.textarea.nativeElement.style;
      const textareaUserSelect =
        textareaStyle.userSelect ||
        textareaStyle.webkitUserSelect ||
        (textareaStyle as any).msUserSelect ||
        (textareaStyle as any).MozUserSelect;

      expect(inputUserSelect).toBe('none');
      expect(textareaUserSelect).toBe('none');
    });

    it('should allow native dragging on draggable elements when gestures are set to auto', () => {
      const fixture = TestBed.createComponent(TooltipOnDraggableElement);
      fixture.detectChanges();

      expect(fixture.componentInstance.button.nativeElement.style.webkitUserDrag).toBeFalsy();
    });

    it('should disable native dragging on draggable elements when gestures are set to on', () => {
      const fixture = TestBed.createComponent(TooltipOnDraggableElement);
      fixture.componentInstance.touchGestures = 'on';
      fixture.detectChanges();

      const styles = fixture.componentInstance.button.nativeElement.style;

      if ('webkitUserDrag' in styles) {
        expect(styles.webkitUserDrag).toBe('none');
      }
    });

    it('should not open on `mouseenter` on iOS', () => {
      platform.IOS = true;
      platform.ANDROID = false;

      const fixture = TestBed.createComponent(BasicTooltipDemo);

      fixture.detectChanges();
      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseenter');
      fixture.detectChanges();

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
    });

    it('should not open on `mouseenter` on Android', () => {
      platform.ANDROID = true;
      platform.IOS = false;

      const fixture = TestBed.createComponent(BasicTooltipDemo);

      fixture.detectChanges();
      dispatchMouseEvent(fixture.componentInstance.button.nativeElement, 'mouseenter');
      fixture.detectChanges();

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
    });
  });

  describe('mouse wheel handling', () => {
    it('should close when a wheel event causes the cursor to leave the trigger', fakeAsync(() => {
      // We don't bind wheel events on mobile devices.
      if (platform.IOS || platform.ANDROID) {
        return;
      }

      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'mouseenter');
      fixture.detectChanges();
      tick(500); // Finish the open delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true);
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      // Simulate the pointer at the bottom/right of the page.
      const wheelEvent = createFakeEvent('wheel');
      Object.defineProperties(wheelEvent, {
        clientX: { get: () => window.innerWidth },
        clientY: { get: () => window.innerHeight },
      });

      dispatchEvent(button, wheelEvent);
      fixture.detectChanges();
      tick(1500); // Finish the delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false);

      assertTooltipInstance(fixture.componentInstance.tooltip, false);
      flush();
    }));

    it('should not close if the cursor is over the trigger after a wheel event', fakeAsync(() => {
      // We don't bind wheel events on mobile devices.
      if (platform.IOS || platform.ANDROID) {
        return;
      }

      const fixture = TestBed.createComponent(BasicTooltipDemo);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'mouseenter');
      fixture.detectChanges();
      tick(500); // Finish the open delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, true); // Finish the animation.
      assertTooltipInstance(fixture.componentInstance.tooltip, true);

      // Simulate the pointer over the trigger.
      const triggerRect = button.getBoundingClientRect();
      const wheelEvent = createFakeEvent('wheel');
      Object.defineProperties(wheelEvent, {
        clientX: { get: () => triggerRect.left + 1 },
        clientY: { get: () => triggerRect.top + 1 },
      });

      dispatchEvent(button, wheelEvent);
      fixture.detectChanges();
      tick(1500); // Finish the delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false); // Finish the exit animation.

      assertTooltipInstance(fixture.componentInstance.tooltip, true);
      flush();
    }));
  });

  describe('close button', () => {
    it('should show close button on click trigger', fakeAsync(() => {
      const fixture = TestBed.createComponent(TriggerConfigurableTooltip);
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      dispatchFakeEvent(button, 'click');
      fixture.detectChanges();
      tick(500); // Finish the open delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false); // Finish the animation.

      expect(document.querySelector('.sbb-tooltip')!.classList).toContain(
        'sbb-tooltip-has-close-button',
      );
      expect(document.querySelector('.sbb-tooltip-close-button')).toBeTruthy();
      flush();
    }));

    it('should hide close button on hover trigger', fakeAsync(() => {
      const fixture = TestBed.createComponent(TriggerConfigurableTooltip);
      fixture.componentInstance.trigger = 'hover';
      fixture.detectChanges();

      fixture.componentInstance.tooltip.show(); // fake hover

      fixture.detectChanges();
      tick(500); // Finish the open delay.
      fixture.detectChanges();
      finishCurrentTooltipAnimation(overlayContainerElement, false); // Finish the animation.

      expect(document.querySelector('.sbb-tooltip')!.classList).not.toContain(
        'sbb-tooltip-has-close-button',
      );
      expect(document.querySelector('.sbb-tooltip-close-button')).toBeFalsy();
      flush();
    }));
  });

  describe('click bubbling', () => {
    it('should stop propagation on trigger click', fakeAsync(() => {
      const fixture = TestBed.createComponent(TooltipTriggerBubble);
      const outerClickSpy = spyOn(fixture.componentInstance, 'outerDivClick');
      fixture.detectChanges();

      fixture.nativeElement.querySelector('button').click();
      tick();

      expect(outerClickSpy).not.toHaveBeenCalled();
    }));

    it('should allow propagation on hover click', fakeAsync(() => {
      const fixture = TestBed.createComponent(TooltipTriggerBubble);
      fixture.componentInstance.trigger = 'hover';
      fixture.detectChanges();
      const outerClickSpy = spyOn(fixture.componentInstance, 'outerDivClick');
      fixture.detectChanges();

      fixture.nativeElement.querySelector('button').click();
      tick();

      expect(outerClickSpy).toHaveBeenCalled();
    }));

    it('should allow propagation when disabled', fakeAsync(() => {
      const fixture = TestBed.createComponent(TooltipTriggerBubble);
      fixture.componentInstance.disabled = true;
      fixture.detectChanges();
      const outerClickSpy = spyOn(fixture.componentInstance, 'outerDivClick');
      fixture.detectChanges();

      fixture.nativeElement.querySelector('button').click();
      tick();

      expect(outerClickSpy).toHaveBeenCalled();
    }));
  });
});

@Component({
  selector: 'app',
  template: ` @if (showButton) {
    <button
      #button
      [sbbTooltip]="message"
      [sbbTooltipClass]="{ 'custom-one': showTooltipClass, 'custom-two': showTooltipClass }"
      [sbbTooltipPosition]="position"
      sbbTooltipPanelClass="custom-panel-one custom-panel-two"
      [sbbTooltipTouchGestures]="touchGestures"
      [sbbTooltipDisabled]="tooltipDisabled"
    >
      Button
    </button>
  }`,
  imports: [SbbTooltipModule],
})
class BasicTooltipDemo {
  position = 'below';
  message: any = initialTooltipMessage;
  showButton = true;
  showTooltipClass = false;
  touchGestures: TooltipTouchGestures = 'auto';
  tooltipDisabled = false;
  @ViewChild(SbbTooltip) tooltip: SbbTooltip;
  @ViewChild('button') button: ElementRef<HTMLButtonElement>;
}

@Component({
  selector: 'app',
  template: ` <div
    cdkScrollable
    style="padding: 100px; margin: 300px;
      height: 200px; width: 200px; overflow: auto;"
  >
    @if (showButton) {
      <button style="margin-bottom: 600px" [sbbTooltip]="message">Button</button>
    }
  </div>`,
  imports: [SbbTooltipModule],
})
class ScrollableTooltipDemo {
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
  selector: 'app',
  template: ` <button [sbbTooltip]="message">Button</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SbbTooltipModule],
})
class OnPushTooltipDemo {
  position: string = 'below';
  message: string = initialTooltipMessage;
}

@Component({
  selector: 'app',
  template: ` @for (tooltip of tooltips; track tooltip) {
    <button [sbbTooltip]="tooltip">Button {{ tooltip }}</button>
  }`,
  imports: [SbbTooltipModule],
})
class DynamicTooltipsDemo {
  tooltips: string[] = [];
}

@Component({
  template: `<button [sbbTooltip]="message" [attr.aria-label]="message">Click me</button>`,
  imports: [SbbTooltipModule],
})
class DataBoundAriaLabelTooltip {
  message = 'Hello there';
}

@Component({
  template: `
    <input #input sbbTooltip="Something" [sbbTooltipTouchGestures]="touchGestures" />

    <textarea
      #textarea
      sbbTooltip="Another thing"
      [sbbTooltipTouchGestures]="touchGestures"
    ></textarea>
  `,
  imports: [SbbTooltipModule],
})
class TooltipOnTextFields {
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement>;
  touchGestures: TooltipTouchGestures = 'auto';
}

@Component({
  template: `
    <button
      #button
      draggable="true"
      sbbTooltip="Drag me"
      [sbbTooltipTouchGestures]="touchGestures"
    ></button>
  `,
  imports: [SbbTooltipModule],
})
class TooltipOnDraggableElement {
  @ViewChild('button') button: ElementRef;
  touchGestures: TooltipTouchGestures = 'auto';
}

@Component({
  template: `
    <button [sbbTooltip]="'content'" [sbbTooltipTrigger]="trigger">Show tooltip</button>
  `,
  imports: [SbbTooltipModule],
})
class TriggerConfigurableTooltip {
  @ViewChild(SbbTooltip) tooltip: SbbTooltip;
  trigger: 'click' | 'hover' = 'click';
}

@Component({
  selector: 'app',
  template: `<button #button [sbbTooltip]="message">Button</button>`,
  standalone: false,
})
class TooltipDemoWithoutPositionBinding {
  message: any = initialTooltipMessage;
  @ViewChild(SbbTooltip) tooltip: SbbTooltip;
  @ViewChild('button') button: ElementRef<HTMLButtonElement>;
}

@Component({
  template: `
    <div (click)="outerDivClick()">
      <button
        [sbbTooltip]="'content'"
        [sbbTooltipTrigger]="trigger"
        [sbbTooltipDisabled]="disabled"
      >
        Show tooltip
      </button>
    </div>
  `,
  imports: [SbbTooltipModule],
})
class TooltipTriggerBubble {
  disabled = false;
  trigger: 'click' | 'hover' = 'click';
  @ViewChild(SbbTooltip) tooltip: SbbTooltip;

  outerDivClick() {}
}

/** Asserts whether a tooltip directive has a tooltip instance. */
function assertTooltipInstance(tooltip: SbbTooltip, shouldExist: boolean): void {
  // Note that we have to cast this to a boolean, because Jasmine will go into an infinite loop
  // if it tries to stringify the `_tooltipInstance` when an assertion fails. The infinite loop
  // happens due to the `_tooltipInstance` having a circular structure.
  expect(!!tooltip._tooltipInstance).toBe(shouldExist);
}

function finishCurrentTooltipAnimation(overlayContainer: HTMLElement, isVisible: boolean) {
  const tooltip = overlayContainer.querySelector('.sbb-tooltip-container')!;
  const event = createFakeEvent('animationend');
  Object.defineProperty(event, 'animationName', {
    get: () => `sbb-tooltip-container-${isVisible ? 'show' : 'hide'}`,
  });
  dispatchEvent(tooltip, event);
}

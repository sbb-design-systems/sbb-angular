import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ViewChild } from '@angular/core';
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import {
  createMouseEvent,
  dispatchEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  switchToLean,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbTooltipChangeEvent, SbbTooltipModule, SbbTooltipWrapper } from './index';

describe('SbbTooltipWrapper', () => {
  describe('', () => {
    let component: TooltipTestComponent;
    let fixture: ComponentFixture<TooltipTestComponent>;
    let overlayContainer: OverlayContainer;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbIconTestingModule, NoopAnimationsModule],
      }).compileComponents();

      inject([OverlayContainer], (oc: OverlayContainer) => {
        overlayContainer = oc;
      })();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TooltipTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show tooltip via clicking on the button', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      tick(0);
      fixture.detectChanges();
      flush();

      expect(buttonElement.classList.contains('sbb-tooltip-trigger')).toBeTrue();
      expect(buttonElement.classList.contains('sbb-tooltip-trigger-active')).toBeTrue();
      expect(buttonElement.attributes.getNamedItem('aria-expanded')?.value).toBe('true');
      expect(component.tooltip._tooltip._isTooltipVisible()).toBeTrue();
    }));

    it('should hide the tooltip by clicking outside the tooltip', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      fixture.detectChanges();

      // click the second time on question mark to close the tooltip
      dispatchMouseEvent(fixture.nativeElement, 'click');
      fixture.detectChanges();
      flush();

      expect(buttonElement.classList.contains('sbb-tooltip-trigger')).toBeTrue();
      expect(buttonElement.classList.contains('sbb-tooltip-trigger-active')).toBeFalse();
      expect(buttonElement.attributes.getNamedItem('aria-expanded')?.value).toBe('false');
      expect(component.tooltip._tooltip._isTooltipVisible()).toBeFalse();
    }));

    it('should close tooltip by internal button', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      fixture.detectChanges();

      const buttonInTooltip = overlayContainer
        .getContainerElement()
        .querySelector('.sbb-secondary-button');
      expect(buttonInTooltip).toBeDefined();
      dispatchMouseEvent(buttonInTooltip!, 'click');
      fixture.detectChanges();

      expect(component.tooltip._tooltip._isTooltipVisible()).toBeFalse();
    });

    it('should close tooltip programmatically', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      fixture.detectChanges();
      flush();
      expect(component.tooltip._tooltip._isTooltipVisible()).toBeTrue();

      component.tooltip.hide();
      fixture.detectChanges();
      flush();

      expect(component.tooltip._tooltip._isTooltipVisible()).toBeFalse();
    }));

    it('should not close tooltip on mouse events inside overlay', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      fixture.detectChanges();
      flush();

      const tooltipBody = overlayContainer.getContainerElement().querySelector('.sbb-tooltip')!;
      dispatchMouseEvent(tooltipBody, 'click');
      dispatchMouseEvent(tooltipBody, 'mousedown');

      fixture.detectChanges();
      flush();

      expect(component.tooltip._tooltip._isTooltipVisible()).toBeTrue();
    }));

    it('should not close tooltip when releasing mouse outside overlay', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      fixture.detectChanges();
      flush();

      dispatchMouseEvent(
        overlayContainer.getContainerElement().querySelector('.sbb-tooltip')!,
        'mousedown',
      );
      dispatchEvent(document.body, createMouseEvent('mouseup'));

      fixture.detectChanges();
      flush();

      expect(component.tooltip._tooltip._isTooltipVisible()).toBeTrue();
    }));

    it('should close the tooltip on ESC', fakeAsync(() => {
      component.tooltip.show();
      tick();
      fixture.detectChanges();

      const buttonInTooltip = overlayContainer.getContainerElement().querySelector('button')!;
      dispatchKeyboardEvent(buttonInTooltip, 'keydown', ESCAPE);
      fixture.detectChanges();
      flush();

      expect(component.tooltip._tooltip._isTooltipVisible()).toBeFalse();
    }));

    it('should emit event on showing tooltip', fakeAsync(() => {
      let event: SbbTooltipChangeEvent | null = null;
      component.tooltip.opened.subscribe((e) => (event = e));

      component.tooltip.show();
      tick();
      fixture.detectChanges();
      tick();

      expect(event!.instance).toBe(component.tooltip._tooltip);

      // Note that we aren't asserting anything, but `fakeAsync` will
      // throw if we have any timers by the end of the test.
      fixture.destroy();
    }));

    it('should emit event on dismissing tooltip', fakeAsync(() => {
      let event: SbbTooltipChangeEvent | null = null;
      component.tooltip.dismissed.subscribe((e) => (event = e));

      component.tooltip.show();
      tick();
      fixture.detectChanges();
      component.tooltip.hide();
      tick();
      fixture.detectChanges();
      tick();

      expect(event!.instance).toBe(component.tooltip._tooltip);

      // Note that we aren't asserting anything, but `fakeAsync` will
      // throw if we have any timers by the end of the test.
      fixture.destroy();
    }));

    it('should forward tooltip classes', fakeAsync(() => {
      component.tooltip.show();
      tick();
      fixture.detectChanges();

      const tooltipPanel = overlayContainer
        .getContainerElement()
        .querySelector('.sbb-tooltip-panel') as HTMLElement;
      expect(tooltipPanel.classList).toContain('custom-panel-one');
      expect(tooltipPanel.classList).toContain('custom-panel-two');

      const tooltip = overlayContainer
        .getContainerElement()
        .querySelector('.sbb-tooltip') as HTMLElement;
      expect(tooltip.classList).toContain('custom-one');
      expect(tooltip.classList).toContain('custom-two');
    }));

    it('should show the correct icon in standard variant', () => {
      const spy = jasmine.createSpy('icon subject spy');
      component.tooltip._svgIcon.subscribe(spy);
      expect(spy).toHaveBeenCalledWith('circle-question-mark-small');
    });

    describe('lean', () => {
      switchToLean();
      it('should show the correct icon', () => {
        const spy = jasmine.createSpy('icon subject spy');
        component.tooltip._svgIcon.subscribe(spy);
        expect(spy).toHaveBeenCalledWith('circle-information-small');
      });
    });

    describe('disabled', () => {
      it('should have a disabled attribute and a `sbb-disabled` class', () => {
        component.tooltipDisabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        const buttonElement = fixture.debugElement.query(By.css('button'))
          .nativeElement as HTMLElement;
        expect(buttonElement.hasAttribute('disabled')).toBeTrue();
        expect(buttonElement.classList.contains('sbb-disabled')).toBeTrue();
      });

      it('should not show the tooltip when disabled', fakeAsync(() => {
        const buttonElement = fixture.debugElement.query(By.css('button'))
          .nativeElement as HTMLElement;
        buttonElement.click();
        tick(0);
        expect(component.tooltip._tooltip._isTooltipVisible()).toBeTrue();

        component.tooltipDisabled = true;
        fixture.detectChanges();
        buttonElement.click();
        tick(0);
        fixture.detectChanges();
        flush();
        expect(component.tooltip._tooltip._isTooltipVisible()).toBeFalse();
      }));
    });
  });

  describe('using two tooltips', () => {
    let component: DoubleTooltipTestComponent;
    let fixture: ComponentFixture<DoubleTooltipTestComponent>;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbIconTestingModule, NoopAnimationsModule],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(DoubleTooltipTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should hide tooltip after showing another one', fakeAsync(() => {
      const [tooltip1, tooltip2] = fixture.debugElement.queryAll(By.css('sbb-tooltip button'));
      tooltip1.nativeElement.click();
      tick(0);
      fixture.detectChanges();

      expect(component.t1._tooltip._isTooltipVisible()).toBeTrue();
      expect(component.t2._tooltip._isTooltipVisible()).toBeFalse();

      tooltip2.nativeElement.click();
      tick(0);
      fixture.detectChanges();

      expect(component.t1._tooltip._isTooltipVisible()).toBeFalse();
      expect(component.t2._tooltip._isTooltipVisible()).toBeTrue();

      flush();
    }));
  });
});

@Component({
  selector: 'sbb-tooltip-test',
  template: `
    <sbb-tooltip
      #t1
      [disabled]="tooltipDisabled"
      [sbbTooltipClass]="['custom-one', 'custom-two']"
      [sbbTooltipPanelClass]="['custom-panel-one', 'custom-panel-two']"
    >
      <p>This is a tooltip with a button inside.</p>
      <button sbb-secondary-button (click)="t1.hide()">Close tooltip</button>
    </sbb-tooltip>
  `,
  standalone: true,
  imports: [SbbTooltipModule, SbbButtonModule],
})
class TooltipTestComponent {
  @ViewChild('t1', { static: true }) tooltip: SbbTooltipWrapper;
  tooltipDisabled = false;
}

@Component({
  selector: 'sbb-double-tooltip-test',
  template: `
    <sbb-tooltip #t1>
      <p>This is a tooltip with a button inside.</p>
      <button sbb-secondary-button (click)="t1.hide()">Close tooltip</button>
    </sbb-tooltip>
    <sbb-tooltip #t2>
      <p>This is another tooltip with a link!</p>
      <a href="#" sbb-link>I am a link</a>
    </sbb-tooltip>
  `,
  standalone: true,
  imports: [SbbTooltipModule],
})
class DoubleTooltipTestComponent {
  @ViewChild('t1', { static: true }) t1: SbbTooltipWrapper;
  @ViewChild('t2', { static: true }) t2: SbbTooltipWrapper;
}

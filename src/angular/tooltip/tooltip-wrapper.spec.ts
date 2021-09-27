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
  dispatchMouseEvent,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbTooltipModule, SbbTooltipWrapper } from './index';

describe('SbbTooltipWrapper', () => {
  describe('', () => {
    let component: TooltipTestComponent;
    let fixture: ComponentFixture<TooltipTestComponent>;
    let overlayContainer: OverlayContainer;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [SbbTooltipModule, SbbButtonModule, SbbIconTestingModule, NoopAnimationsModule],
          declarations: [TooltipTestComponent],
        }).compileComponents();

        inject([OverlayContainer], (oc: OverlayContainer) => {
          overlayContainer = oc;
        })();
      })
    );

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
      expect(component.t1._tooltip._isTooltipVisible()).toBeTrue();
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
      expect(component.t1._tooltip._isTooltipVisible()).toBeFalse();
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

      expect(component.t1._tooltip._isTooltipVisible()).toBeFalse();
    });

    it('should close tooltip programmatically', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      fixture.detectChanges();
      flush();
      expect(component.t1._tooltip._isTooltipVisible()).toBeTrue();

      component.t1.hide();
      fixture.detectChanges();
      flush();

      expect(component.t1._tooltip._isTooltipVisible()).toBeFalse();
    }));

    it('should not close tooltip on mouse events inside overlay', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      fixture.detectChanges();
      flush();

      const tooltipBody = overlayContainer
        .getContainerElement()
        .querySelector('.sbb-tooltip-content-body')!;
      dispatchMouseEvent(tooltipBody, 'click');
      dispatchMouseEvent(tooltipBody, 'mousedown');

      fixture.detectChanges();
      flush();

      expect(component.t1._tooltip._isTooltipVisible()).toBeTrue();
    }));

    it('should not close tooltip when releasing mouse outside overlay', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLElement;
      buttonElement.click();
      fixture.detectChanges();
      flush();

      dispatchMouseEvent(
        overlayContainer.getContainerElement().querySelector('.sbb-tooltip-content-body')!,
        'mousedown'
      );
      dispatchEvent(document.body, createMouseEvent('mouseup'));

      fixture.detectChanges();
      flush();

      expect(component.t1._tooltip._isTooltipVisible()).toBeTrue();
    }));
  });

  describe('using two tooltips', () => {
    let component: DoubleTooltipTestComponent;
    let fixture: ComponentFixture<DoubleTooltipTestComponent>;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [SbbTooltipModule, SbbIconTestingModule, NoopAnimationsModule],
          declarations: [DoubleTooltipTestComponent],
        }).compileComponents();
      })
    );

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
    <sbb-tooltip #t1>
      <p>This is a tooltip with a button inside.</p>
      <button sbb-secondary-button (click)="t1.hide(true)">Close tooltip</button>
    </sbb-tooltip>
  `,
})
class TooltipTestComponent {
  @ViewChild('t1', { static: true }) t1: SbbTooltipWrapper;
}

@Component({
  selector: 'sbb-double-tooltip-test',
  template: `
    <sbb-tooltip #t1>
      <p>This is a tooltip with a button inside.</p>
      <button sbb-secondary-button (click)="t1.hide(true)">Close tooltip</button>
    </sbb-tooltip>
    <sbb-tooltip #t2>
      <p>This is another tooltip with a link!</p>
      <a href="#" sbbLink>I am a link</a>
    </sbb-tooltip>
  `,
})
class DoubleTooltipTestComponent {
  @ViewChild('t1', { static: true }) t1: SbbTooltipWrapper;
  @ViewChild('t2', { static: true }) t2: SbbTooltipWrapper;
}

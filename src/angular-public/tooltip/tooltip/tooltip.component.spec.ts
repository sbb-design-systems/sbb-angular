import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@sbb-esta/angular-core/base/tooltip';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';
import { createMouseEvent, dispatchEvent } from '@sbb-esta/angular-core/testing';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';

import { SbbTooltipModule } from '../tooltip.module';

import { SbbTooltipComponent } from './tooltip.component';

@Component({
  selector: 'sbb-tooltip-test',
  template: `
    <sbb-tooltip #t1 (opened)="onOpen()" (closed)="onClose()">
      <p>This is a tooltip with a button inside.</p>
      <button mode="secondary" sbbButton (click)="t1.close(true)">Close tooltip</button>
    </sbb-tooltip>
  `,
})
class TooltipTestComponent {
  @ViewChild('t1', { static: true }) t1: SbbTooltipComponent;
  onClose() {}
  onOpen() {}
}

@Component({
  selector: 'sbb-double-tooltip-test',
  template: `
    <sbb-tooltip #t1 (opened)="onOpen()" (closed)="onClose()">
      <p>This is a tooltip with a button inside.</p>
      <button mode="secondary" sbbButton (click)="t1.close(true)">Close tooltip</button>
    </sbb-tooltip>
    <sbb-tooltip #t2 (opened)="onOpen()" (closed)="onClose()">
      <p>This is another tooltip with a link!</p>
      <a href="#" sbbLink>I am a link</a>
    </sbb-tooltip>
  `,
})
class DoubleTooltipTestComponent {
  @ViewChild('t1', { static: true }) t1: SbbTooltipComponent;
  @ViewChild('t2', { static: true }) t2: SbbTooltipComponent;

  onClose() {}
  onOpen() {}
}

describe('SbbTooltip', () => {
  let component: SbbTooltipComponent;
  let fixture: ComponentFixture<SbbTooltipComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbIconModule, SbbIconTestingModule, CommonModule, PortalModule, OverlayModule],
        providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
        declarations: [SbbTooltipComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('SbbTooltip using mock component for single tooltip', () => {
  let singleComponentTest: TooltipTestComponent;
  let singleFixtureTest: ComponentFixture<TooltipTestComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbTooltipModule, SbbButtonModule, SbbIconTestingModule],
        declarations: [TooltipTestComponent],
      }).compileComponents();

      inject([OverlayContainer], (oc: OverlayContainer) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
      })();
    })
  );

  beforeEach(() => {
    singleFixtureTest = TestBed.createComponent(TooltipTestComponent);
    singleComponentTest = singleFixtureTest.componentInstance;
    singleFixtureTest.detectChanges();
  });

  it('should create component test', async () => {
    expect(singleComponentTest).toBeTruthy();
  });

  it('should open tooltip by question mark', () => {
    const buttonQuestionMark = singleComponentTest.t1.tooltipTrigger.nativeElement;
    buttonQuestionMark.click();
    singleFixtureTest.detectChanges();

    expect(buttonQuestionMark.classList.contains('sbb-tooltip-trigger')).toBeTrue();
    expect(buttonQuestionMark.classList.contains('sbb-tooltip-trigger-active')).toBeTrue();

    const tooltipElement = singleFixtureTest.debugElement.query(By.css('.sbb-tooltip'));

    expect(tooltipElement.attributes['aria-expanded']).toBe('true');
    expect(singleComponentTest.t1.overlayAttached).toBe(true);
  });

  it('should close tooltip by question mark', () => {
    const buttonQuestionMark = singleComponentTest.t1.tooltipTrigger.nativeElement;
    buttonQuestionMark.click();
    singleFixtureTest.detectChanges();

    // click the second time on question mark to close the tooltip
    buttonQuestionMark.click();
    singleFixtureTest.detectChanges();

    expect(buttonQuestionMark.classList.contains('sbb-tooltip-trigger')).toBeTrue();
    expect(buttonQuestionMark.classList.contains('sbb-tooltip-trigger-active')).toBeFalse();

    const tooltipElement = singleFixtureTest.debugElement.query(By.css('.sbb-tooltip'));

    expect(tooltipElement.attributes['aria-expanded']).toBe('false');
    expect(singleComponentTest.t1.overlayAttached).toBe(false);
  });

  it('should close tooltip by internal button', () => {
    const buttonQuestionMark = singleComponentTest.t1.tooltipTrigger.nativeElement;
    buttonQuestionMark.click();
    singleFixtureTest.detectChanges();

    const internalButton = singleFixtureTest.debugElement.query(
      By.css('.sbb-button-secondary')
    ).nativeElement;
    internalButton.click();
    singleFixtureTest.detectChanges();

    expect(buttonQuestionMark.classList).toContain('sbb-tooltip-trigger');

    const tooltipElement = singleFixtureTest.debugElement.queryAll(By.css('.sbb-tooltip'))[0];

    expect(tooltipElement.attributes['aria-expanded']).toBe('false');
    expect(singleComponentTest.t1.overlayAttached).toBe(false);
  });

  it('should close tooltip programmatically', () => {
    const buttonQuestionMark = singleComponentTest.t1.tooltipTrigger.nativeElement;
    buttonQuestionMark.click();
    singleFixtureTest.detectChanges();
    expect(singleComponentTest.t1.overlayAttached).toBe(true);

    singleComponentTest.t1.close();

    expect(buttonQuestionMark.classList.contains('sbb-tooltip-trigger')).toBeTrue();
    expect(buttonQuestionMark.classList.contains('sbb-tooltip-trigger-active')).toBeFalse();
    expect(singleComponentTest.t1.overlayAttached).toBe(false);
  });

  it('should close tooltip clicking outside it', () => {
    const buttonQuestionMark = singleComponentTest.t1.tooltipTrigger.nativeElement;
    buttonQuestionMark.click();
    singleFixtureTest.detectChanges();
    expect(singleComponentTest.t1.overlayAttached).toBe(true);

    dispatchEvent(document.body, createMouseEvent('mousedown'));

    expect(singleComponentTest.t1.overlayAttached).toBe(false);
  });

  it('should not close tooltip on mouse events inside overlay', () => {
    const buttonQuestionMark = singleComponentTest.t1.tooltipTrigger.nativeElement;
    buttonQuestionMark.click();
    singleFixtureTest.detectChanges();
    expect(singleComponentTest.t1.overlayAttached).toBe(true);

    dispatchEvent(
      overlayContainer.getContainerElement().querySelector('.sbb-tooltip-content-body') as Node,
      createMouseEvent('click')
    );

    dispatchEvent(
      overlayContainer.getContainerElement().querySelector('.sbb-tooltip-content-body') as Node,
      createMouseEvent('mousedown')
    );

    expect(singleComponentTest.t1.overlayAttached).toBe(true);
  });

  it('should not close tooltip when releasing mouse outside overlay', () => {
    const buttonQuestionMark = singleComponentTest.t1.tooltipTrigger.nativeElement;
    buttonQuestionMark.click();
    singleFixtureTest.detectChanges();
    expect(singleComponentTest.t1.overlayAttached).toBe(true);

    dispatchEvent(
      overlayContainer.getContainerElement().querySelector('.sbb-tooltip-content-body') as Node,
      createMouseEvent('mousedown')
    );

    dispatchEvent(document.body, createMouseEvent('mouseup'));

    expect(singleComponentTest.t1.overlayAttached).toBe(true);
  });
});

describe('SbbTooltip using mock component for double tooltip', () => {
  let doubleComponentTest: DoubleTooltipTestComponent;
  let doubleFixtureTest: ComponentFixture<DoubleTooltipTestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SbbTooltipModule, SbbIconTestingModule],
        declarations: [DoubleTooltipTestComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    doubleFixtureTest = TestBed.createComponent(DoubleTooltipTestComponent);
    doubleComponentTest = doubleFixtureTest.componentInstance;
    doubleFixtureTest.detectChanges();
  });

  it('should close a tooltip opened clicking on another tooltip', () => {
    const buttonQuestionMarkT1 = doubleComponentTest.t1.tooltipTrigger.nativeElement;
    buttonQuestionMarkT1.click();
    doubleFixtureTest.detectChanges();

    expect(doubleComponentTest.t1.overlayAttached).toBe(true);
    expect(doubleComponentTest.t2.tooltipRef).toBeUndefined();

    const buttonQuestionMarkT2 = doubleComponentTest.t2.tooltipTrigger.nativeElement;

    buttonQuestionMarkT2.click();
    doubleFixtureTest.detectChanges();

    expect(doubleComponentTest.t1.overlayAttached).toBeFalsy();
    expect(doubleComponentTest.t2.overlayAttached).toBe(true);
  });
});

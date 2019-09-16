import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@sbb-esta/angular-core/base';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { configureTestSuite } from 'ng-bullet';

import { TooltipModule } from '../tooltip.module';

import { TooltipComponent } from './tooltip.component';

@Component({
  selector: 'sbb-true-hover-configuration-tooltip-test',
  template: `
    <sbb-tooltip #t1 trigger="hover">
      <p>Dies ist ein Tooltip mit einer Schaltfläche im Inneren.</p>
    </sbb-tooltip>
  `
})
class TooltipHoverTrueTestComponent {
  @ViewChild('t1', { static: true }) t1: TooltipComponent;
}

@Component({
  selector: 'sbb-true-hover-configuration-and-delay-settings-tooltip-test',
  template: `
    <sbb-tooltip #t1 trigger="hover" hoverCloseDelay="2000" hoverOpenDelay="2000">
      <p>Dies ist ein Tooltip mit einer Schaltfläche im Inneren.</p>
    </sbb-tooltip>
  `
})
class TooltipHoverTrueAndDelaySettingsTestComponent {
  @ViewChild('t1', { static: true }) t1: TooltipComponent;
  closeDelay = 2000;
  openDelay = 2000;
}

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, CommonModule, PortalModule, OverlayModule],
      providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
      declarations: [TooltipComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exist sbb-tooltip', () => {
    expect(component.cssClass).toEqual(true);
  });
});

describe('Tooltip using hover configuration with default delay', () => {
  let component: TooltipHoverTrueTestComponent;
  let fixture: ComponentFixture<TooltipHoverTrueTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, CommonModule, PortalModule, OverlayModule, TooltipModule],
      providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
      declarations: [TooltipHoverTrueTestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipHoverTrueTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component tooltip with hover configuration is created', async () => {
    expect(component).toBeTruthy();
  });

  it('When hovering with mouse tooltip open short/no timeout', fakeAsync(() => {
    const eventMouseEnter = new Event('mouseenter');
    const eventMouseLeave = new Event('mouseleave');
    const tooltipElement = fixture.debugElement.query(By.css('sbb-tooltip')).nativeElement;
    const buttonQuestionMark = component.t1.tooltipTrigger.nativeElement;
    tooltipElement.dispatchEvent(eventMouseEnter);
    tick(100);
    fixture.detectChanges();
    expect(buttonQuestionMark.attributes['class'].value).toContain('sbb-tooltip-trigger-active');

    tooltipElement.dispatchEvent(eventMouseLeave);
    tick(100);
    fixture.detectChanges();
    expect(buttonQuestionMark.attributes['class'].value).not.toContain(
      'sbb-tooltip-trigger-active'
    );
  }));
});

describe('Tooltip using hover configuration and delay settings for open and close', () => {
  let component: TooltipHoverTrueAndDelaySettingsTestComponent;
  let fixture: ComponentFixture<TooltipHoverTrueAndDelaySettingsTestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [IconCollectionModule, CommonModule, PortalModule, OverlayModule, TooltipModule],
      providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
      declarations: [TooltipHoverTrueAndDelaySettingsTestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipHoverTrueAndDelaySettingsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component tooltip with hover configuration is created', async () => {
    expect(component).toBeTruthy();
  });

  it('When hovering with mouse tooltip open long timeout', fakeAsync(() => {
    const eventMouseEnter = new Event('mouseenter');
    const eventMouseLeave = new Event('mouseleave');
    const tooltipElement = fixture.debugElement.query(By.css('sbb-tooltip')).nativeElement;
    const buttonQuestionMark = component.t1.tooltipTrigger.nativeElement;
    tooltipElement.dispatchEvent(eventMouseEnter);
    tick(2001);
    fixture.detectChanges();
    expect(buttonQuestionMark.attributes['class'].value).toContain('sbb-tooltip-trigger-active');

    tooltipElement.dispatchEvent(eventMouseLeave);
    tick(2001);
    fixture.detectChanges();
    expect(buttonQuestionMark.attributes['class'].value).not.toContain(
      'sbb-tooltip-trigger-active'
    );
  }));
});

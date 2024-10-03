import { FocusMonitor } from '@angular/cdk/a11y';
import { DOWN_ARROW, END, HOME, UP_ARROW } from '@angular/cdk/keycodes';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchKeyboardEvent,
} from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import {
  SbbAccordion,
  SbbAccordionModule,
  SbbExpansionPanel,
  SbbExpansionPanelHeader,
} from './index';

describe('AccordionDirective', () => {
  let focusMonitor: FocusMonitor;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SbbIconTestingModule],
    });

    inject([FocusMonitor], (fm: FocusMonitor) => {
      focusMonitor = fm;
    })();
  }));

  it('should ensure only one item is expanded at a time', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.sbb-expansion-panel'));
    const panelInstances = fixture.componentInstance.panels.toArray();

    panelInstances[0].expanded = true;
    fixture.detectChanges();
    expect(items[0].classes['sbb-expanded']).toBeTruthy();
    expect(items[1].classes['sbb-expanded']).toBeFalsy();

    panelInstances[1].expanded = true;
    fixture.detectChanges();
    expect(items[0].classes['sbb-expanded']).toBeFalsy();
    expect(items[1].classes['sbb-expanded']).toBeTruthy();
  });

  it('should allow multiple items to be expanded simultaneously', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.componentInstance.multi = true;
    fixture.detectChanges();

    const panels = fixture.debugElement.queryAll(By.css('.sbb-expansion-panel'));
    const panelInstances = fixture.componentInstance.panels.toArray();

    panelInstances[0].expanded = true;
    panelInstances[1].expanded = true;
    fixture.detectChanges();
    expect(panels[0].classes['sbb-expanded']).toBeTruthy();
    expect(panels[1].classes['sbb-expanded']).toBeTruthy();
  });

  it('should expand or collapse all enabled items', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const panels = fixture.debugElement.queryAll(By.css('.sbb-expansion-panel'));

    fixture.componentInstance.multi = true;
    fixture.componentInstance.panels.toArray()[1].expanded = true;
    fixture.detectChanges();
    expect(panels[0].classes['sbb-expanded']).toBeFalsy();
    expect(panels[1].classes['sbb-expanded']).toBeTruthy();

    fixture.componentInstance.accordion.openAll();
    fixture.detectChanges();
    expect(panels[0].classes['sbb-expanded']).toBeTruthy();
    expect(panels[1].classes['sbb-expanded']).toBeTruthy();

    fixture.componentInstance.accordion.closeAll();
    fixture.detectChanges();
    expect(panels[0].classes['sbb-expanded']).toBeFalsy();
    expect(panels[1].classes['sbb-expanded']).toBeFalsy();
  });

  it('should not expand or collapse disabled items', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const panels = fixture.debugElement.queryAll(By.css('.sbb-expansion-panel'));

    fixture.componentInstance.multi = true;
    fixture.componentInstance.panels.toArray()[1].disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.componentInstance.accordion.openAll();
    fixture.detectChanges();
    expect(panels[0].classes['sbb-expanded']).toBeTruthy();
    expect(panels[1].classes['sbb-expanded']).toBeFalsy();

    fixture.componentInstance.accordion.closeAll();
    fixture.detectChanges();
    expect(panels[0].classes['sbb-expanded']).toBeFalsy();
    expect(panels[1].classes['sbb-expanded']).toBeFalsy();
  });

  it('should not register nested panels to the same accordion', () => {
    const fixture = TestBed.createComponent(NestedPanel);
    fixture.detectChanges();

    const innerPanel = fixture.componentInstance.innerPanel;
    const outerPanel = fixture.componentInstance.outerPanel;

    expect(innerPanel.accordion).not.toBe(outerPanel.accordion);
  });

  it('should update the expansion panel if hideToggle changed', () => {
    const fixture = TestBed.createComponent(AccordionWithHideToggle);
    const panel = fixture.debugElement.query(By.directive(SbbExpansionPanel))!;

    fixture.detectChanges();

    expect(panel.nativeElement.querySelector('.sbb-expansion-panel-header-indicator'))
      .withContext('Expected the expansion indicator to be present.')
      .toBeTruthy();

    fixture.componentInstance.hideToggle = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(panel.nativeElement.querySelector('.sbb-expansion-panel-header-indicator'))
      .withContext('Expected the expansion indicator to be removed.')
      .toBeFalsy();
  });

  it('should move focus to the next header when pressing the down arrow', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    focusMonitor.focusVia(headerElements[0].nativeElement, 'keyboard');
    headers.forEach((header) => spyOn(header, 'focus'));

    // Stop at the second-last header so focus doesn't wrap around.
    for (let i = 0; i < headerElements.length - 1; i++) {
      dispatchKeyboardEvent(headerElements[i].nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();
      expect(headers[i + 1].focus).toHaveBeenCalledTimes(1);
    }
  });

  it('should not move focus into nested accordions', () => {
    const fixture = TestBed.createComponent(NestedAccordions);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();
    const { firstInnerHeader, secondOuterHeader } = fixture.componentInstance;

    focusMonitor.focusVia(headerElements[0].nativeElement, 'keyboard');
    headers.forEach((header) => spyOn(header, 'focus'));

    dispatchKeyboardEvent(headerElements[0].nativeElement, 'keydown', DOWN_ARROW);
    fixture.detectChanges();
    expect(secondOuterHeader.focus).toHaveBeenCalledTimes(1);
    expect(firstInnerHeader.focus).not.toHaveBeenCalled();
  });

  it('should move focus to the next header when pressing the up arrow', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    focusMonitor.focusVia(headerElements[headerElements.length - 1].nativeElement, 'keyboard');
    headers.forEach((header) => spyOn(header, 'focus'));

    // Stop before the first header
    for (let i = headers.length - 1; i > 0; i--) {
      dispatchKeyboardEvent(headerElements[i].nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();
      expect(headers[i - 1].focus).toHaveBeenCalledTimes(1);
    }
  });

  it('should skip disabled items when moving focus with the keyboard', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const panels = fixture.componentInstance.panels.toArray();
    const headers = fixture.componentInstance.headers.toArray();

    focusMonitor.focusVia(headerElements[0].nativeElement, 'keyboard');
    headers.forEach((header) => spyOn(header, 'focus'));
    panels[1].disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    dispatchKeyboardEvent(headerElements[0].nativeElement, 'keydown', DOWN_ARROW);
    fixture.detectChanges();

    expect(headers[1].focus).not.toHaveBeenCalled();
    expect(headers[2].focus).toHaveBeenCalledTimes(1);
  });

  it('should focus the first header when pressing the home key', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach((header) => spyOn(header, 'focus'));
    const event = dispatchKeyboardEvent(
      headerElements[headerElements.length - 1].nativeElement,
      'keydown',
      HOME,
    );
    fixture.detectChanges();

    expect(headers[0].focus).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not handle the home key when it is pressed with a modifier', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach((header) => spyOn(header, 'focus'));
    const eventTarget = headerElements[headerElements.length - 1].nativeElement;
    const event = createKeyboardEvent('keydown', HOME, undefined, { alt: true });

    dispatchEvent(eventTarget, event);
    fixture.detectChanges();

    expect(headers[0].focus).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('should focus the last header when pressing the end key', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach((header) => spyOn(header, 'focus'));
    const event = dispatchKeyboardEvent(headerElements[0].nativeElement, 'keydown', END);
    fixture.detectChanges();

    expect(headers[headers.length - 1].focus).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should not handle the end key when it is pressed with a modifier', () => {
    const fixture = TestBed.createComponent(SetOfItems);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach((header) => spyOn(header, 'focus'));

    const eventTarget = headerElements[0].nativeElement;
    const event = createKeyboardEvent('keydown', END, undefined, { alt: true });

    dispatchEvent(eventTarget, event);
    fixture.detectChanges();

    expect(headers[headers.length - 1].focus).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });
});

@Component({
  template: `
    <sbb-accordion [multi]="multi">
      @for (i of [0, 1, 2, 3]; track i) {
        <sbb-expansion-panel>
          <sbb-expansion-panel-header>Summary {{ i }}</sbb-expansion-panel-header>
          <p>Content</p>
        </sbb-expansion-panel>
      }
    </sbb-accordion>
  `,
  standalone: true,
  imports: [SbbAccordionModule],
})
class SetOfItems {
  @ViewChild(SbbAccordion) accordion: SbbAccordion;
  @ViewChildren(SbbExpansionPanel) panels: QueryList<SbbExpansionPanel>;
  @ViewChildren(SbbExpansionPanelHeader) headers: QueryList<SbbExpansionPanelHeader>;

  multi: boolean = false;
}

@Component({
  template: ` <sbb-accordion>
    <sbb-expansion-panel>
      <sbb-expansion-panel-header>Summary 0</sbb-expansion-panel-header>
      Content 0

      <sbb-expansion-panel>
        <sbb-expansion-panel-header #firstInnerHeader>Summary 0-0</sbb-expansion-panel-header>
        Content 0-0
      </sbb-expansion-panel>
    </sbb-expansion-panel>

    <sbb-expansion-panel>
      <sbb-expansion-panel-header #secondOuterHeader>Summary 1</sbb-expansion-panel-header>
      Content 1
    </sbb-expansion-panel>
  </sbb-accordion>`,
  standalone: true,
  imports: [SbbAccordionModule],
})
class NestedAccordions {
  @ViewChildren(SbbExpansionPanelHeader) headers: QueryList<SbbExpansionPanelHeader>;
  @ViewChild('secondOuterHeader') secondOuterHeader: SbbExpansionPanelHeader;
  @ViewChild('firstInnerHeader') firstInnerHeader: SbbExpansionPanelHeader;
}

@Component({
  template: `
    <sbb-accordion>
      <sbb-expansion-panel #outerPanel="sbbExpansionPanel">
        <sbb-expansion-panel-header>Outer Panel</sbb-expansion-panel-header>
        <sbb-expansion-panel #innerPanel="sbbExpansionPanel">
          <sbb-expansion-panel-header>Inner Panel</sbb-expansion-panel-header>
          <p>Content</p>
        </sbb-expansion-panel>
      </sbb-expansion-panel>
    </sbb-accordion>
  `,
  standalone: true,
  imports: [SbbAccordionModule],
})
class NestedPanel {
  @ViewChild('outerPanel') outerPanel: SbbExpansionPanel;
  @ViewChild('innerPanel') innerPanel: SbbExpansionPanel;
}

@Component({
  template: `
    <sbb-accordion [hideToggle]="hideToggle">
      <sbb-expansion-panel>
        <sbb-expansion-panel-header>Header</sbb-expansion-panel-header>
        <p>Content</p>
      </sbb-expansion-panel>
    </sbb-accordion>
  `,
  standalone: true,
  imports: [SbbAccordionModule],
})
class AccordionWithHideToggle {
  hideToggle = false;
}

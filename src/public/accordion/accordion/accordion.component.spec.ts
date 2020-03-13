import { DOWN_ARROW, END, HOME, UP_ARROW } from '@angular/cdk/keycodes';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchEvent, dispatchKeyboardEvent } from '@sbb-esta/angular-core/testing';

import {
  AccordionDirective,
  AccordionModule,
  ExpansionPanelComponent,
  ExpansionPanelHeaderComponent
} from '../public_api';

// tslint:disable:i18n
@Component({
  template: `
    <sbb-accordion [multi]="multi">
      <sbb-expansion-panel *ngFor="let i of [0, 1, 2, 3]">
        <sbb-expansion-panel-header>Summary {{ i }}</sbb-expansion-panel-header>
        <p>Content</p>
      </sbb-expansion-panel>
    </sbb-accordion>
  `
})
class SetOfItemsComponent {
  @ViewChild(AccordionDirective, { static: true }) accordion: AccordionDirective;
  @ViewChildren(ExpansionPanelComponent) panels: QueryList<ExpansionPanelComponent>;
  @ViewChildren(ExpansionPanelHeaderComponent) headers: QueryList<ExpansionPanelHeaderComponent>;

  multi = true;
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
  `
})
class NestedPanelComponent {
  @ViewChild('outerPanel', { static: true }) outerPanel: ExpansionPanelComponent;
  @ViewChild('innerPanel', { static: true }) innerPanel: ExpansionPanelComponent;
}

@Component({
  template: `
    <sbb-accordion [hideToggle]="hideToggle">
      <sbb-expansion-panel>
        <sbb-expansion-panel-header>Header</sbb-expansion-panel-header>
        <p>Content</p>
      </sbb-expansion-panel>
    </sbb-accordion>
  `
})
class AccordionWithHideToggleComponent {
  hideToggle = false;
}

describe('AccordionDirective', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, AccordionModule],
      declarations: [AccordionWithHideToggleComponent, NestedPanelComponent, SetOfItemsComponent]
    }).compileComponents();
  }));

  it('should allow multiple items to be expanded simultaneously', () => {
    const fixture = TestBed.createComponent(SetOfItemsComponent);
    fixture.detectChanges();

    const panels = fixture.debugElement.queryAll(By.css('.sbb-expansion-panel'));
    const panelInstances = fixture.componentInstance.panels.toArray();

    panelInstances[0].expanded = true;
    panelInstances[1].expanded = true;
    fixture.detectChanges();
    expect(panels[0].classes['sbb-expanded']).toBeTruthy();
    expect(panels[1].classes['sbb-expanded']).toBeTruthy();
  });

  it('should ensure only one item is expanded at a time', () => {
    const fixture = TestBed.createComponent(SetOfItemsComponent);
    fixture.componentInstance.multi = false;
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

  it('should expand or collapse all enabled items', () => {
    const fixture = TestBed.createComponent(SetOfItemsComponent);
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
    const fixture = TestBed.createComponent(SetOfItemsComponent);
    fixture.detectChanges();

    const panels = fixture.debugElement.queryAll(By.css('.sbb-expansion-panel'));

    fixture.componentInstance.multi = true;
    fixture.componentInstance.panels.toArray()[1].disabled = true;
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
    const fixture = TestBed.createComponent(NestedPanelComponent);
    const innerPanel = fixture.componentInstance.innerPanel;
    const outerPanel = fixture.componentInstance.outerPanel;

    expect(innerPanel.accordion).not.toBe(outerPanel.accordion);
  });

  it('should update the expansion panel if hideToggle changed', () => {
    const fixture = TestBed.createComponent(AccordionWithHideToggleComponent);
    const panel = fixture.debugElement.query(By.directive(ExpansionPanelComponent));

    fixture.detectChanges();

    expect(panel.nativeElement.querySelector('.sbb-no-toggle')).toBeFalsy(
      'Expected the expansion indicator to be present.'
    );

    fixture.componentInstance.hideToggle = true;
    fixture.detectChanges();

    expect(panel.nativeElement.querySelector('.sbb-no-toggle')).toBeTruthy(
      'Expected the expansion indicator to be removed.'
    );
  });

  it('should move focus to the next header when pressing the down arrow', () => {
    const fixture = TestBed.createComponent(SetOfItemsComponent);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    dispatchEvent(headerElements[0].nativeElement, new KeyboardEvent('focus'));
    fixture.detectChanges();

    headers.forEach(header => spyOn(header, 'focus'));

    // Stop at the second-last header so focus doesn't wrap around.
    for (let i = 0; i < headerElements.length - 1; i++) {
      dispatchKeyboardEvent(headerElements[i].nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      expect(headers[i + 1].focus).toHaveBeenCalledTimes(1);
    }
  });

  it('should move focus to the next header when pressing the up arrow', () => {
    const fixture = TestBed.createComponent(SetOfItemsComponent);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    dispatchEvent(
      headerElements[headerElements.length - 1].nativeElement,
      new KeyboardEvent('focus')
    );
    fixture.detectChanges();

    headers.forEach(header => spyOn(header, 'focus'));

    // Stop before the first header
    for (let i = headers.length - 1; i > 0; i--) {
      dispatchKeyboardEvent(headerElements[i].nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();
      expect(headers[i - 1].focus).toHaveBeenCalledTimes(1);
    }
  });

  it('should skip disabled items when moving focus with the keyboard', () => {
    const fixture = TestBed.createComponent(SetOfItemsComponent);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const panels = fixture.componentInstance.panels.toArray();
    const headers = fixture.componentInstance.headers.toArray();

    dispatchEvent(headerElements[0].nativeElement, new KeyboardEvent('focus'));
    fixture.detectChanges();

    headers.forEach(header => spyOn(header, 'focus'));
    panels[1].disabled = true;
    fixture.detectChanges();

    dispatchKeyboardEvent(headerElements[0].nativeElement, 'keydown', DOWN_ARROW);
    fixture.detectChanges();

    expect(headers[1].focus).not.toHaveBeenCalled();
    expect(headers[2].focus).toHaveBeenCalledTimes(1);
  });

  it('should focus the first header when pressing the home key', () => {
    const fixture = TestBed.createComponent(SetOfItemsComponent);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach(header => spyOn(header, 'focus'));
    dispatchKeyboardEvent(headerElements[headerElements.length - 1].nativeElement, 'keydown', HOME);
    fixture.detectChanges();

    expect(headers[0].focus).toHaveBeenCalledTimes(1);
  });

  it('should focus the last header when pressing the end key', () => {
    const fixture = TestBed.createComponent(SetOfItemsComponent);
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('sbb-expansion-panel-header'));
    const headers = fixture.componentInstance.headers.toArray();

    headers.forEach(header => spyOn(header, 'focus'));
    dispatchKeyboardEvent(headerElements[0].nativeElement, 'keydown', END);
    fixture.detectChanges();

    expect(headers[headers.length - 1].focus).toHaveBeenCalledTimes(1);
  });
});

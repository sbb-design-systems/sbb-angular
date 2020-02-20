import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { dispatchEvent } from '@sbb-esta/angular-core/testing';
import { createMouseEvent } from '@sbb-esta/angular-core/testing';
import { BadgeModule } from '@sbb-esta/angular-public/badge';
import { configureTestSuite } from 'ng-bullet';

import { TabComponent } from '../tab/tab.component';

import { TabsComponent } from './tabs.component';

// tslint:disable:i18n
@Component({
  template: `
    <sbb-tabs>
      <sbb-tab label="TAB 1">
        <h4>Content 1</h4>
        <p>Here comes the content for tab 1 ...</p>
      </sbb-tab>
      <sbb-tab label="TAB 2">
        <h4>Content 2</h4>
        <p>Here comes the content for tab 2 ...</p>
      </sbb-tab>
      <sbb-tab
        label="TAB 2"
        *ngIf="isVisible"
        (disableChange)="disableChange($event)"
        (removeChange)="removeChange($event)"
      >
        <h4>Content 3</h4>
        <p>Here comes the content for tab 3 ...</p>
      </sbb-tab>
    </sbb-tabs>
  `
})
class TabsTestComponent {
  isVisible = true;
  disableChange() {}
  removeChange() {}
}

describe('TabsComponent', () => {
  let component: TabsTestComponent;
  let fixture: ComponentFixture<TabsTestComponent>;
  let tabs: DebugElement[];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TabsTestComponent, TabsComponent, TabComponent],
      imports: [BadgeModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsTestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    tabs = fixture.debugElement.queryAll(By.directive(TabComponent));
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should select first tab as default', async () => {
    await fixture.whenStable();
    expect(tabs[0].componentInstance.active).toBeTruthy();
    expect(tabs[1].componentInstance.active && tabs[2].componentInstance.active).toBeFalsy();
  });

  it('should if I click the second tab make it active and deactivate the first', async () => {
    const tab2Label = fixture.debugElement.queryAll(By.css('.sbb-tabs-tablist-item-button'))[1]
      .nativeElement;
    dispatchEvent(tab2Label, createMouseEvent('click'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(tabs[0].componentInstance.active && tabs[2].componentInstance.active).toBeFalsy();
    expect(tabs[1].componentInstance.active).toBeTruthy();
  });

  it('should a disabled tab to be empty', () => {
    const lastTabEl = tabs[2];
    const lastTabComp = lastTabEl.componentInstance;
    lastTabComp.disabled = true;
    fixture.detectChanges();

    expect(lastTabEl.nativeElement.textContent.trim()).toBe('');
  });

  it('should when setting a disabled tab emit an event', () => {
    spyOn(component, 'disableChange');
    const lastTabEl = tabs[2];
    const lastTabComp = lastTabEl.componentInstance;
    lastTabComp.disabled = true;
    fixture.detectChanges();

    expect(component.disableChange).toHaveBeenCalled();
  });

  it('should when a tab is removed the number of tabs labels to be equal to 2', () => {
    component.isVisible = false;
    fixture.detectChanges();

    const tabsLabels = fixture.debugElement.queryAll(By.css('.sbb-tabs-tablist-item-button'));
    expect(tabsLabels.length).toBe(2);
  });

  it('should when removing a tab emit an event', () => {
    spyOn(component, 'removeChange');

    component.isVisible = false;
    fixture.detectChanges();

    expect(component.removeChange).toHaveBeenCalled();
  });
});

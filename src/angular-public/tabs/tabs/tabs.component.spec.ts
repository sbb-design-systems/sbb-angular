import { PortalModule } from '@angular/cdk/portal';
import { Component, DebugElement, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { dispatchEvent } from '@sbb-esta/angular-core/testing';
import { createMouseEvent } from '@sbb-esta/angular-core/testing';
import { SbbBadgeModule } from '@sbb-esta/angular-public/badge';

import { SbbTabContent } from '../tab/tab-content';
import { SbbTab } from '../tab/tab.component';

import { SbbTabs } from './tabs.component';

// tslint:disable:i18n
@Component({
  template: `
    <sbb-tabs #tabs>
      <sbb-tab label="TAB 1">
        <h4>Content 1</h4>
        <p>Here comes the content for tab 1 ...</p>
      </sbb-tab>
      <sbb-tab label="TAB 2">
        <h4>Content 2</h4>
        <p>Here comes the content for tab 2 ...</p>
      </sbb-tab>
      <sbb-tab label="TAB 2" *ngIf="isVisible">
        <h4>Content 3</h4>
        <p>Here comes the content for tab 3 ...</p>
      </sbb-tab>
      <sbb-tab label="TAB 4">
        <ng-template sbbTabContent>
          <sbb-tab-content-test (ngOnInitCalled)="onContentInitalized()"></sbb-tab-content-test>
        </ng-template>
      </sbb-tab>
    </sbb-tabs>
  `,
})
class TabsTestComponent {
  @ViewChild('tabs') tabsComponent: SbbTabs;
  isVisible: boolean = true;
  numberOfTimesSubComponentHasBeenInitialized = 0;
  onContentInitalized() {
    this.numberOfTimesSubComponentHasBeenInitialized++;
  }
}

@Component({
  template: '',
  selector: 'sbb-tab-content-test',
})
class TabContentTestComponent implements OnInit {
  @Output() ngOnInitCalled = new EventEmitter<void>();
  ngOnInit() {
    this.ngOnInitCalled.emit();
  }
}

describe('SbbTabs', () => {
  let component: TabsTestComponent;
  let fixture: ComponentFixture<TabsTestComponent>;
  let tabs: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsTestComponent, TabContentTestComponent, SbbTabs, SbbTab, SbbTabContent],
      imports: [SbbBadgeModule, PortalModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsTestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    tabs = fixture.debugElement.queryAll(By.directive(SbbTab));
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

  it('should when a tab is removed the number of tabs labels to be equal to 2', () => {
    component.isVisible = false;
    fixture.detectChanges();

    const tabsLabels = fixture.debugElement.queryAll(By.css('.sbb-tabs-tablist-item-button'));
    expect(tabsLabels.length).toBe(3);
  });

  it('should not render lazy tab content', () => {
    fixture.detectChanges();

    expect(component.numberOfTimesSubComponentHasBeenInitialized).toEqual(0);
  });

  it('should render lazy tab content, when opening tab', async () => {
    component.tabsComponent.openTabByIndex(3);
    fixture.detectChanges();
    await fixture.whenStable();
    component.tabsComponent.openTabByIndex(1);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.numberOfTimesSubComponentHasBeenInitialized).toEqual(1);
  });

  it('should render lazy tab content multiple times, when switching tabs', async () => {
    component.tabsComponent.openTabByIndex(3);
    fixture.detectChanges();
    await fixture.whenStable();

    component.tabsComponent.openTabByIndex(1);
    fixture.detectChanges();
    await fixture.whenStable();

    component.tabsComponent.openTabByIndex(3);
    fixture.detectChanges();
    await fixture.whenStable();

    component.tabsComponent.openTabByIndex(1);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.numberOfTimesSubComponentHasBeenInitialized).toEqual(2);
  });
});

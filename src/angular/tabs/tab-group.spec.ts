import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, DebugElement, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { dispatchFakeEvent, dispatchKeyboardEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { Observable } from 'rxjs';

import { SbbTab, SbbTabGroup, SbbTabHeader, SbbTabsModule, SBB_TABS_CONFIG } from './index';

describe('SbbTabGroup', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule],
    });

    TestBed.compileComponents();
  }));

  describe('basic behavior', () => {
    let fixture: ComponentFixture<SimpleTabsTestApp>;
    let element: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabsTestApp);
      element = fixture.nativeElement;
    });

    it('should default to the first tab', () => {
      checkSelectedIndex(1, fixture);
    });

    it('will properly load content on first change detection pass', () => {
      fixture.detectChanges();
      expect(element.querySelectorAll('.sbb-tab-body')[1].querySelectorAll('span').length).toBe(3);
    });

    it('should change selected index on click', () => {
      const component = fixture.debugElement.componentInstance;
      component.selectedIndex = 0;
      checkSelectedIndex(0, fixture);

      // select the second tab
      let tabLabel = fixture.debugElement.queryAll(By.css('.sbb-tab-label'))[1];
      tabLabel.nativeElement.click();
      checkSelectedIndex(1, fixture);

      // select the third tab
      tabLabel = fixture.debugElement.queryAll(By.css('.sbb-tab-label'))[2];
      tabLabel.nativeElement.click();
      checkSelectedIndex(2, fixture);
    });

    it('should support two-way binding for selectedIndex', fakeAsync(() => {
      const component = fixture.componentInstance;
      component.selectedIndex = 0;

      fixture.detectChanges();

      const tabLabel = fixture.debugElement.queryAll(By.css('.sbb-tab-label'))[1];
      tabLabel.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(component.selectedIndex).toBe(1);
    }));

    // Note: needs to be `async` in order to fail when we expect it to.
    it('should set to correct tab on fast change', waitForAsync(() => {
      const component = fixture.componentInstance;
      component.selectedIndex = 0;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      setTimeout(() => {
        component.selectedIndex = 1;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        setTimeout(() => {
          component.selectedIndex = 0;
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(component.selectedIndex).toBe(0);
          });
        }, 1);
      }, 1);
    }));

    it('should change tabs based on selectedIndex', fakeAsync(() => {
      const component = fixture.componentInstance;
      const tabComponent = fixture.debugElement.query(By.css('sbb-tab-group'))!.componentInstance;

      spyOn(component, 'handleSelection').and.callThrough();

      checkSelectedIndex(1, fixture);

      tabComponent.selectedIndex = 2;
      fixture.changeDetectorRef.markForCheck();

      checkSelectedIndex(2, fixture);
      tick();

      expect(component.handleSelection).toHaveBeenCalledTimes(1);
      expect(component.selectEvent.index).toBe(2);
    }));

    it('should update tab positions when selected index is changed', () => {
      fixture.detectChanges();
      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;
      const tabs: SbbTab[] = component._tabs.toArray();

      expect(tabs[0].position).toBeLessThan(0);
      expect(tabs[1].position).toBe(0);
      expect(tabs[2].position).toBeGreaterThan(0);

      // Move to third tab
      component.selectedIndex = 2;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(tabs[0].position).toBeLessThan(0);
      expect(tabs[1].position).toBeLessThan(0);
      expect(tabs[2].position).toBe(0);

      // Move to the first tab
      component.selectedIndex = 0;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(tabs[0].position).toBe(0);
      expect(tabs[1].position).toBeGreaterThan(0);
      expect(tabs[2].position).toBeGreaterThan(0);
    });

    it('should clamp the selected index to the size of the number of tabs', () => {
      fixture.detectChanges();
      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;

      // Set the index to be negative, expect first tab selected
      fixture.componentInstance.selectedIndex = -1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.selectedIndex).toBe(0);

      // Set the index beyond the size of the tabs, expect last tab selected
      fixture.componentInstance.selectedIndex = 3;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(component.selectedIndex).toBe(2);
    });

    it('should not crash when setting the selected index to NaN', () => {
      const component = fixture.debugElement.componentInstance;

      expect(() => {
        component.selectedIndex = NaN;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should set the isActive flag on each of the tabs', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const tabs = fixture.componentInstance.tabs.toArray();

      expect(tabs[0].isActive).toBe(false);
      expect(tabs[1].isActive).toBe(true);
      expect(tabs[2].isActive).toBe(false);

      fixture.componentInstance.selectedIndex = 2;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      expect(tabs[0].isActive).toBe(false);
      expect(tabs[1].isActive).toBe(false);
      expect(tabs[2].isActive).toBe(true);
    }));

    it('should fire animation done event', fakeAsync(() => {
      fixture.detectChanges();

      spyOn(fixture.componentInstance, 'animationDone');
      const tabLabel = fixture.debugElement.queryAll(By.css('.sbb-tab-label'))[1];
      tabLabel.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.animationDone).toHaveBeenCalledTimes(1);
    }));

    it('should add the proper `aria-setsize` and `aria-posinset`', () => {
      fixture.detectChanges();

      const labels = Array.from(element.querySelectorAll('.sbb-tab-label'));

      expect(labels.map((label) => label.getAttribute('aria-posinset'))).toEqual(['1', '2', '3']);
      expect(labels.every((label) => label.getAttribute('aria-setsize') === '3')).toBe(true);
    });

    it('should emit focusChange event on click', () => {
      spyOn(fixture.componentInstance, 'handleFocus');
      fixture.detectChanges();

      const tabLabels = fixture.debugElement.queryAll(By.css('.sbb-tab-label'));

      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(0);

      tabLabels[2].nativeElement.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledWith(
        jasmine.objectContaining({ index: 2 }),
      );
    });

    it('should emit focusChange on arrow key navigation', () => {
      spyOn(fixture.componentInstance, 'handleFocus');
      fixture.detectChanges();

      const tabLabels = fixture.debugElement.queryAll(By.css('.sbb-tab-label'));
      const tabLabelContainer = fixture.debugElement.query(By.css('.sbb-tab-label-container'))!
        .nativeElement as HTMLElement;

      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(0);

      // In order to verify that the `focusChange` event also fires with the correct
      // index, we focus the third tab before testing the keyboard navigation.
      tabLabels[2].nativeElement.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(1);

      dispatchKeyboardEvent(tabLabelContainer, 'keydown', LEFT_ARROW);

      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(2);
      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledWith(
        jasmine.objectContaining({ index: 1 }),
      );
    });

    it('should clean up the tabs QueryList on destroy', () => {
      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;
      const spy = jasmine.createSpy('complete spy');
      const subscription = component._tabs.changes.subscribe({ complete: spy });

      fixture.destroy();

      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });

    it('should emit focusChange when a tab receives focus', fakeAsync(() => {
      spyOn(fixture.componentInstance, 'handleFocus');
      fixture.detectChanges();

      const tabLabels = fixture.debugElement.queryAll(By.css('.sbb-tab-label'));

      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(0);

      // In order to verify that the `focusChange` event also fires with the correct
      // index, we focus the second tab before testing the keyboard navigation.
      dispatchFakeEvent(tabLabels[2].nativeElement, 'focus');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.handleFocus).toHaveBeenCalledWith(
        jasmine.objectContaining({ index: 2 }),
      );
    }));

    it('should be able to programmatically focus a particular tab', () => {
      fixture.detectChanges();
      const tabGroup: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      ).componentInstance;
      const tabHeader: SbbTabHeader = fixture.debugElement.query(
        By.css('sbb-tab-header'),
      ).componentInstance;

      expect(tabHeader.focusIndex).not.toBe(3);

      tabGroup.focusTab(3);
      fixture.detectChanges();

      expect(tabHeader.focusIndex).not.toBe(3);
    });

    it('should update the tabindex of the labels when navigating via keyboard', () => {
      fixture.detectChanges();

      const tabLabels = fixture.debugElement
        .queryAll(By.css('.sbb-tab-label'))
        .map((label) => label.nativeElement);
      const tabLabelContainer = fixture.debugElement.query(By.css('.sbb-tab-label-container'))
        .nativeElement as HTMLElement;

      expect(tabLabels.map((label) => label.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);

      dispatchKeyboardEvent(tabLabelContainer, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      expect(tabLabels.map((label) => label.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
    });
  });

  describe('aria labelling', () => {
    let fixture: ComponentFixture<TabGroupWithAriaInputs>;
    let tab: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TabGroupWithAriaInputs);
      fixture.detectChanges();
      tick();
      tab = fixture.nativeElement.querySelector('.sbb-tab-label');
    }));

    it('should not set aria-label or aria-labelledby attributes if they are not passed in', () => {
      expect(tab.hasAttribute('aria-label')).toBe(false);
      expect(tab.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('should set the aria-label attribute', () => {
      fixture.componentInstance.ariaLabel = 'Fruit';
      fixture.detectChanges();

      expect(tab.getAttribute('aria-label')).toBe('Fruit');
    });

    it('should set the aria-labelledby attribute', () => {
      fixture.componentInstance.ariaLabelledby = 'fruit-label';
      fixture.detectChanges();

      expect(tab.getAttribute('aria-labelledby')).toBe('fruit-label');
    });

    it('should not be able to set both an aria-label and aria-labelledby', () => {
      fixture.componentInstance.ariaLabel = 'Fruit';
      fixture.componentInstance.ariaLabelledby = 'fruit-label';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(tab.getAttribute('aria-label')).toBe('Fruit');
      expect(tab.hasAttribute('aria-labelledby')).toBe(false);

      fixture.componentInstance.ariaLabel = 'Veggie';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(tab.getAttribute('aria-label')).toBe('Veggie');
    });
  });

  describe('aria labelling of tab panels', () => {
    let fixture: ComponentFixture<BindedTabsTestApp>;
    let tabPanels: HTMLElement[];

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(BindedTabsTestApp);
      fixture.detectChanges();
      tick();
      tabPanels = Array.from(fixture.nativeElement.querySelectorAll('.sbb-tab-body'));
    }));

    it('should set `aria-hidden="true"` on inactive tab panels', () => {
      fixture.detectChanges();

      expect(tabPanels[0].getAttribute('aria-hidden')).not.toBe('true');
      expect(tabPanels[1].getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('disable tabs', () => {
    let fixture: ComponentFixture<DisabledTabsTestApp>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DisabledTabsTestApp);
    });

    it('should have one disabled tab', () => {
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('.sbb-tab-disabled'));
      expect(labels.length).toBe(1);
      expect(labels[0].nativeElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set the disabled flag on tab', () => {
      fixture.detectChanges();

      const tabs = fixture.componentInstance.tabs.toArray();
      let labels = fixture.debugElement.queryAll(By.css('.sbb-tab-disabled'));
      expect(tabs[2].disabled).toBe(false);
      expect(labels.length).toBe(1);
      expect(labels[0].nativeElement.getAttribute('aria-disabled')).toBe('true');

      fixture.componentInstance.isDisabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(tabs[2].disabled).toBe(true);
      labels = fixture.debugElement.queryAll(By.css('.sbb-tab-disabled'));
      expect(labels.length).toBe(2);
      expect(
        labels.every((label) => label.nativeElement.getAttribute('aria-disabled') === 'true'),
      ).toBe(true);
    });
  });

  describe('dynamic binding tabs', () => {
    let fixture: ComponentFixture<SimpleDynamicTabsTestApp>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SimpleDynamicTabsTestApp);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should be able to add a new tab, select it, and have correct origin position', fakeAsync(() => {
      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;

      let tabs: SbbTab[] = component._tabs.toArray();
      expect(tabs[0].origin).toBe(null);
      expect(tabs[1].origin).toBe(0);
      expect(tabs[2].origin).toBe(null);

      // Add a new tab on the right and select it, expect an origin >= than 0 (animate right)
      fixture.componentInstance.tabs.push({ label: 'New tab', content: 'to right of index' });
      fixture.componentInstance.selectedIndex = 4;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      tabs = component._tabs.toArray();
      expect(tabs[3].origin).toBeGreaterThanOrEqual(0);

      // Add a new tab in the beginning and select it, expect an origin < than 0 (animate left)
      fixture.componentInstance.selectedIndex = 0;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      fixture.componentInstance.tabs.push({ label: 'New tab', content: 'to left of index' });
      fixture.detectChanges();
      tick();

      tabs = component._tabs.toArray();
      expect(tabs[0].origin).toBeLessThan(0);
    }));

    it('should update selected index if the last tab removed while selected', fakeAsync(() => {
      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;

      const numberOfTabs = component._tabs.length;
      fixture.componentInstance.selectedIndex = numberOfTabs - 1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      // Remove last tab while last tab is selected, expect next tab over to be selected
      fixture.componentInstance.tabs.pop();
      fixture.detectChanges();
      tick();

      expect(component.selectedIndex).toBe(numberOfTabs - 2);
    }));

    it('should maintain the selected tab if a new tab is added', () => {
      fixture.detectChanges();
      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;

      fixture.componentInstance.selectedIndex = 1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      // Add a new tab at the beginning.
      fixture.componentInstance.tabs.unshift({ label: 'New tab', content: 'at the start' });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(component.selectedIndex).toBe(2);
      expect(component._tabs.toArray()[2].isActive).toBe(true);
    });

    it('should maintain the selected tab if a tab is removed', () => {
      // Select the second tab.
      fixture.componentInstance.selectedIndex = 1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;

      // Remove the first tab that is right before the selected one.
      fixture.componentInstance.tabs.splice(0, 1);
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      // Since the first tab has been removed and the second one was selected before, the selected
      // tab moved one position to the right. Meaning that the tab is now the first tab.
      expect(component.selectedIndex).toBe(0);
      expect(component._tabs.toArray()[0].isActive).toBe(true);
    });

    it('should be able to select a new tab after creation', fakeAsync(() => {
      fixture.detectChanges();
      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;

      fixture.componentInstance.tabs.push({ label: 'Last tab', content: 'at the end' });
      fixture.changeDetectorRef.markForCheck();
      fixture.componentInstance.selectedIndex = 3;

      fixture.detectChanges();
      tick();

      expect(component.selectedIndex).toBe(3);
      expect(component._tabs.toArray()[3].isActive).toBe(true);
    }));

    it('should not fire `selectedTabChange` when the amount of tabs changes', fakeAsync(() => {
      fixture.detectChanges();
      fixture.componentInstance.selectedIndex = 1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      // Add a new tab at the beginning.
      spyOn(fixture.componentInstance, 'handleSelection');
      fixture.componentInstance.tabs.unshift({ label: 'New tab', content: 'at the start' });
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.handleSelection).not.toHaveBeenCalled();
    }));

    it('should update the newly-selected tab if the previously-selected tab is replaced', fakeAsync(() => {
      const component: SbbTabGroup = fixture.debugElement.query(
        By.css('sbb-tab-group'),
      )!.componentInstance;

      spyOn(fixture.componentInstance, 'handleSelection');

      fixture.componentInstance.tabs[fixture.componentInstance.selectedIndex] = {
        label: 'New',
        content: 'New',
      };
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      expect(component._tabs.get(1)?.isActive).toBe(true);
      expect(fixture.componentInstance.handleSelection).toHaveBeenCalledWith(
        jasmine.objectContaining({ index: 1 }),
      );
    }));
  });

  describe('async tabs', () => {
    let fixture: ComponentFixture<AsyncTabsTestApp>;

    it('should show tabs when they are available', fakeAsync(() => {
      fixture = TestBed.createComponent(AsyncTabsTestApp);

      expect(fixture.debugElement.queryAll(By.css('.sbb-tab-label')).length).toBe(0);

      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();

      expect(fixture.debugElement.queryAll(By.css('.sbb-tab-label')).length).toBe(2);
    }));
  });

  describe('with simple api', () => {
    let fixture: ComponentFixture<TabGroupWithSimpleApi>;
    let tabGroup: SbbTabGroup;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TabGroupWithSimpleApi);
      fixture.detectChanges();
      tick();

      tabGroup = fixture.debugElement.query(By.directive(SbbTabGroup))!
        .componentInstance as SbbTabGroup;
    }));

    it('should support a tab-group with the simple api', fakeAsync(() => {
      expect(getSelectedLabel(fixture).textContent).toMatch('Junk food');
      expect(getSelectedContent(fixture).textContent).toMatch('Pizza, fries');

      tabGroup.selectedIndex = 2;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      expect(getSelectedLabel(fixture).textContent).toMatch('Fruit');
      expect(getSelectedContent(fixture).textContent).toMatch('Apples, grapes');

      fixture.componentInstance.otherLabel = 'Chips';
      fixture.componentInstance.otherContent = 'Salt, vinegar';
      fixture.detectChanges();

      expect(getSelectedLabel(fixture).textContent).toMatch('Chips');
      expect(getSelectedContent(fixture).textContent).toMatch('Salt, vinegar');
    }));

    it('should support @ViewChild in the tab content', () => {
      expect(fixture.componentInstance.legumes).toBeTruthy();
    });

    it('should only have the active tab in the DOM', fakeAsync(() => {
      expect(fixture.nativeElement.textContent).toContain('Pizza, fries');
      expect(fixture.nativeElement.textContent).not.toContain('Peanuts');

      tabGroup.selectedIndex = 3;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      expect(fixture.nativeElement.textContent).not.toContain('Pizza, fries');
      expect(fixture.nativeElement.textContent).toContain('Peanuts');
    }));

    it('should be able to opt into keeping the inactive tab content in the DOM', fakeAsync(() => {
      fixture.componentInstance.preserveContent = true;
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Pizza, fries');
      expect(fixture.nativeElement.textContent).not.toContain('Peanuts');

      tabGroup.selectedIndex = 3;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      expect(fixture.nativeElement.textContent).toContain('Pizza, fries');
      expect(fixture.nativeElement.textContent).toContain('Peanuts');
    }));

    it('should visibly hide the content of inactive tabs', fakeAsync(() => {
      const contentElements: HTMLElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('.sbb-tab-body-content'),
      );

      expect(contentElements.map((element) => element.style.visibility)).toEqual([
        '',
        'hidden',
        'hidden',
        'hidden',
      ]);

      tabGroup.selectedIndex = 2;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      expect(contentElements.map((element) => element.style.visibility)).toEqual([
        'hidden',
        'hidden',
        '',
        'hidden',
      ]);

      tabGroup.selectedIndex = 1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      tick();

      expect(contentElements.map((element) => element.style.visibility)).toEqual([
        'hidden',
        '',
        'hidden',
        'hidden',
      ]);
    }));
  });

  describe('lazy loaded tabs', () => {
    it('should lazy load the second tab', fakeAsync(() => {
      const fixture = TestBed.createComponent(TemplateTabs);
      fixture.detectChanges();
      tick();

      const secondLabel = fixture.debugElement.queryAll(By.css('.sbb-tab-label'))[1];
      secondLabel.nativeElement.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const child = fixture.debugElement.query(By.css('.child'))!;
      expect(child.nativeElement).toBeDefined();
    }));
  });

  describe('special cases', () => {
    it('should not throw an error when binding isActive to the view', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabGroupWithIsActiveBinding);

      expect(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }).not.toThrow();

      expect(fixture.nativeElement.textContent).toContain('pizza is active');
    }));

    it('should not pick up sbb-tab-label from a child tab', fakeAsync(() => {
      const fixture = TestBed.createComponent(NestedTabGroupWithLabel);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const labels = fixture.nativeElement.querySelectorAll('.sbb-tab-label-content');
      const contents = Array.from<HTMLElement>(labels).map((label) => label.textContent?.trim());

      expect(contents).toEqual([
        'Parent 1',
        'Parent 2',
        'Parent 3',
        'Child 1',
        'Child 2',
        'Child 3',
      ]);
    }));
  });

  describe('nested tabs', () => {
    it('should not pick up the tabs from descendant tab groups', fakeAsync(() => {
      const fixture = TestBed.createComponent(NestedTabs);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const groups = fixture.componentInstance.groups.toArray();

      expect(groups.length).toBe(2);
      expect(groups[0]._tabs.map((tab: SbbTab) => tab.textLabel)).toEqual(['One', 'Two']);
      expect(groups[1]._tabs.map((tab: SbbTab) => tab.textLabel)).toEqual([
        'Inner tab one',
        'Inner tab two',
      ]);
    }));

    it('should pick up indirect descendant tabs', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabGroupWithIndirectDescendantTabs);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const tabs = fixture.componentInstance.tabGroup._tabs;
      expect(tabs.map((tab: SbbTab) => tab.textLabel)).toEqual(['One', 'Two']);
    }));
  });

  describe('tall tabs', () => {
    beforeEach(() => {
      window.scrollTo({ top: 0 });
    });

    it('should not scroll when changing tabs by clicking', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabGroupWithSpaceAbove);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      window.scrollBy(0, 250);
      expect(window.scrollY).toBe(250);

      // select the second tab
      const tabLabel = fixture.debugElement.queryAll(By.css('.sbb-tab-label'))[1];
      tabLabel.nativeElement.click();
      checkSelectedIndex(1, fixture);

      expect(window.scrollY).toBe(250);
      tick();
    }));

    it('should not scroll when changing tabs programatically', fakeAsync(() => {
      const fixture = TestBed.createComponent(TabGroupWithSpaceAbove);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      window.scrollBy(0, 250);
      expect(window.scrollY).toBe(250);

      fixture.componentInstance.tabGroup.selectedIndex = 1;
      fixture.detectChanges();

      expect(window.scrollY).toBe(250);
      tick();
    }));
  });

  describe('tabs with custom css classes', () => {
    let fixture: ComponentFixture<TabsWithClassesTestApp>;
    let labelElements: DebugElement[];
    let bodyElements: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TabsWithClassesTestApp);
      fixture.detectChanges();
      labelElements = fixture.debugElement.queryAll(By.css('.sbb-tab-label'));
      bodyElements = fixture.debugElement.queryAll(By.css('sbb-tab-body'));
    });

    it('should apply label/body classes', () => {
      expect(labelElements[1].nativeElement.classList).toContain('hardcoded-label-class');
      expect(bodyElements[1].nativeElement.classList).toContain('hardcoded-body-class');
    });

    it('should set classes as strings dynamically', () => {
      expect(labelElements[0].nativeElement.classList).not.toContain('custom-label-class');
      expect(bodyElements[0].nativeElement.classList).not.toContain('custom-body-class');

      fixture.componentInstance.labelClassList = 'custom-label-class';
      fixture.componentInstance.bodyClassList = 'custom-body-class';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(labelElements[0].nativeElement.classList).toContain('custom-label-class');
      expect(bodyElements[0].nativeElement.classList).toContain('custom-body-class');

      delete fixture.componentInstance.labelClassList;
      delete fixture.componentInstance.bodyClassList;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(labelElements[0].nativeElement.classList).not.toContain('custom-label-class');
      expect(bodyElements[0].nativeElement.classList).not.toContain('custom-body-class');
    });

    it('should set classes as strings array dynamically', () => {
      expect(labelElements[0].nativeElement.classList).not.toContain('custom-label-class');
      expect(bodyElements[0].nativeElement.classList).not.toContain('custom-body-class');

      fixture.componentInstance.labelClassList = ['custom-label-class'];
      fixture.componentInstance.bodyClassList = ['custom-body-class'];
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(labelElements[0].nativeElement.classList).toContain('custom-label-class');
      expect(bodyElements[0].nativeElement.classList).toContain('custom-body-class');

      delete fixture.componentInstance.labelClassList;
      delete fixture.componentInstance.bodyClassList;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(labelElements[0].nativeElement.classList).not.toContain('custom-label-class');
      expect(bodyElements[0].nativeElement.classList).not.toContain('custom-body-class');
    });
  });

  /**
   * Checks that the `selectedIndex` has been updated; checks that the label and body have their
   * respective `active` classes
   */
  function checkSelectedIndex(expectedIndex: number, fixture: ComponentFixture<any>) {
    fixture.detectChanges();

    const tabComponent: SbbTabGroup = fixture.debugElement.query(
      By.css('sbb-tab-group'),
    )!.componentInstance;
    expect(tabComponent.selectedIndex).toBe(expectedIndex);

    const tabLabelElement = fixture.debugElement.query(
      By.css(`.sbb-tab-label:nth-of-type(${expectedIndex + 1})`),
    )!.nativeElement;
    expect(tabLabelElement.classList.contains('sbb-tab-label-active')).toBe(true);

    const tabContentElement = fixture.debugElement.query(
      By.css(`sbb-tab-body:nth-of-type(${expectedIndex + 1})`),
    )!.nativeElement;
    expect(tabContentElement.classList.contains('sbb-tab-body-active')).toBe(true);
  }

  function getSelectedLabel(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('.sbb-tab-label-active');
  }

  function getSelectedContent(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.nativeElement.querySelector('.sbb-tab-body-active');
  }
});

describe('SbbTabNavBar with a default config', () => {
  let fixture: ComponentFixture<SimpleTabsTestApp>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SbbIconTestingModule],
      providers: [{ provide: SBB_TABS_CONFIG, useValue: { dynamicHeight: true } }],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTabsTestApp);
    fixture.detectChanges();
  });

  it('should set whether the height of the tab group is dynamic', () => {
    expect(fixture.componentInstance.tabGroup.dynamicHeight).toBe(true);
  });
});

describe('nested SbbTabGroup with enabled animations', () => {
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SbbIconTestingModule],
    });

    TestBed.compileComponents();
  }));

  it('should not throw when creating a component with nested tab groups', fakeAsync(() => {
    expect(() => {
      const fixture = TestBed.createComponent(NestedTabs);
      fixture.detectChanges();
      tick();
    }).not.toThrow();
  }));

  it('should not throw when setting an animationDuration without units', fakeAsync(() => {
    expect(() => {
      const fixture = TestBed.createComponent(TabsWithCustomAnimationDuration);
      fixture.detectChanges();
      tick();
    }).not.toThrow();
  }));

  it('should calculate hide animation durations', fakeAsync(() => {
    const fixture = TestBed.createComponent(TabsWithCustomAnimationDuration);
    fixture.detectChanges();
    tick();

    const tabGroup = fixture.componentInstance.sbbTabGroup;
    [
      { input: '500ms', output: '166.67ms' },
      { input: '500', output: '166.67ms' },
      { input: '600', output: '200ms' },
      { input: '600s', output: '200s' },
      { input: '0', output: '0ms' },
      { input: 'invalid', output: '0ms' },
      { input: '.6s', output: '0.2s' },
      { input: '1.2s', output: '0.4s' },
    ].forEach((entry) => {
      tabGroup.animationDuration = entry.input;
      expect(tabGroup._animationDurationHide).toBe(entry.output);
    });
  }));
});

@Component({
  template: `
    <sbb-tab-group
      class="tab-group"
      [(selectedIndex)]="selectedIndex"
      (animationDone)="animationDone()"
      (focusChange)="handleFocus($event)"
      (selectedTabChange)="handleSelection($event)"
    >
      <sbb-tab>
        <ng-template sbb-tab-label>Tab One</ng-template>
        Tab one content
      </sbb-tab>
      <sbb-tab>
        <ng-template sbb-tab-label>Tab Two</ng-template>
        <span>Tab </span><span>two</span><span>content</span>
      </sbb-tab>
      <sbb-tab>
        <ng-template sbb-tab-label>Tab Three</ng-template>
        Tab three content
      </sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class SimpleTabsTestApp {
  @ViewChild(SbbTabGroup) tabGroup: SbbTabGroup;
  @ViewChildren(SbbTab) tabs: QueryList<SbbTab>;
  selectedIndex: number = 1;
  focusEvent: any;
  selectEvent: any;
  handleFocus(event: any) {
    this.focusEvent = event;
  }
  handleSelection(event: any) {
    this.selectEvent = event;
  }
  animationDone() {}
}

@Component({
  template: `
    <sbb-tab-group
      class="tab-group"
      [(selectedIndex)]="selectedIndex"
      (focusChange)="handleFocus($event)"
      (selectedTabChange)="handleSelection($event)"
    >
      @for (tab of tabs; track tab) {
        <sbb-tab>
          <ng-template sbb-tab-label>{{ tab.label }}</ng-template>
          {{ tab.content }}
        </sbb-tab>
      }
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class SimpleDynamicTabsTestApp {
  tabs = [
    { label: 'Label 1', content: 'Content 1' },
    { label: 'Label 2', content: 'Content 2' },
    { label: 'Label 3', content: 'Content 3' },
  ];
  selectedIndex: number = 1;
  focusEvent: any;
  selectEvent: any;
  handleFocus(event: any) {
    this.focusEvent = event;
  }
  handleSelection(event: any) {
    this.selectEvent = event;
  }
}

@Component({
  template: `
    <sbb-tab-group class="tab-group" [(selectedIndex)]="selectedIndex">
      @for (tab of tabs; track tab) {
        <sbb-tab label="{{ tab.label }}">
          {{ tab.content }}
        </sbb-tab>
      }
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class BindedTabsTestApp {
  tabs = [
    { label: 'one', content: 'one' },
    { label: 'two', content: 'two' },
  ];
  selectedIndex = 0;

  addNewActiveTab(): void {
    this.tabs.push({
      label: 'new tab',
      content: 'new content',
    });
    this.selectedIndex = this.tabs.length - 1;
  }
}

@Component({
  template: `
    <sbb-tab-group class="tab-group">
      <sbb-tab>
        <ng-template sbb-tab-label>Tab One</ng-template>
        Tab one content
      </sbb-tab>
      <sbb-tab disabled>
        <ng-template sbb-tab-label>Tab Two</ng-template>
        Tab two content
      </sbb-tab>
      <sbb-tab [disabled]="isDisabled">
        <ng-template sbb-tab-label>Tab Three</ng-template>
        Tab three content
      </sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class DisabledTabsTestApp {
  @ViewChildren(SbbTab) tabs: QueryList<SbbTab>;
  isDisabled = false;
}

@Component({
  template: `
    <sbb-tab-group class="tab-group">
      @for (tab of tabs | async; track tab) {
        <sbb-tab>
          <ng-template sbb-tab-label>{{ tab.label }}</ng-template>
          {{ tab.content }}
        </sbb-tab>
      }
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule, AsyncPipe],
})
class AsyncTabsTestApp implements OnInit {
  private _tabs = [
    { label: 'one', content: 'one' },
    { label: 'two', content: 'two' },
  ];

  tabs: Observable<any>;

  ngOnInit() {
    // Use ngOnInit because there is some issue with scheduling the async task in the constructor.
    this.tabs = new Observable((observer: any) => {
      setTimeout(() => observer.next(this._tabs));
    });
  }
}

@Component({
  template: `
    <sbb-tab-group [preserveContent]="preserveContent">
      <sbb-tab label="Junk food"> Pizza, fries </sbb-tab>
      <sbb-tab label="Vegetables"> Broccoli, spinach </sbb-tab>
      <sbb-tab [label]="otherLabel"> {{ otherContent }} </sbb-tab>
      <sbb-tab label="Legumes"> <p #legumes>Peanuts</p> </sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class TabGroupWithSimpleApi {
  preserveContent = false;
  otherLabel = 'Fruit';
  otherContent = 'Apples, grapes';
  @ViewChild('legumes') legumes: any;
}

@Component({
  template: `
    <sbb-tab-group>
      <sbb-tab label="One">Tab one content</sbb-tab>
      <sbb-tab label="Two">
        Tab two content
        <sbb-tab-group [dynamicHeight]="true">
          <sbb-tab label="Inner tab one">Inner content one</sbb-tab>
          <sbb-tab label="Inner tab two">Inner content two</sbb-tab>
        </sbb-tab-group>
      </sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class NestedTabs {
  @ViewChildren(SbbTabGroup) groups: QueryList<SbbTabGroup>;
}

@Component({
  template: `
    <sbb-tab-group>
      <sbb-tab label="One"> Eager </sbb-tab>
      <sbb-tab label="Two">
        <ng-template sbbTabContent>
          <div class="child">Hi</div>
        </ng-template>
      </sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class TemplateTabs {}

@Component({
  template: `
    <sbb-tab-group>
      <sbb-tab [aria-label]="ariaLabel" [aria-labelledby]="ariaLabelledby"></sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class TabGroupWithAriaInputs {
  ariaLabel: string;
  ariaLabelledby: string;
}

@Component({
  template: `
    <sbb-tab-group>
      <sbb-tab label="Junk food" #pizza> Pizza, fries </sbb-tab>
      <sbb-tab label="Vegetables"> Broccoli, spinach </sbb-tab>
    </sbb-tab-group>

    @if (pizza.isActive) {
      <div>pizza is active</div>
    }
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class TabGroupWithIsActiveBinding {}

@Component({
  template: `
    <sbb-tab-group animationDuration="500">
      <sbb-tab label="One">Tab one content</sbb-tab>
      <sbb-tab label="Two">Tab two content</sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class TabsWithCustomAnimationDuration {
  @ViewChild(SbbTabGroup) sbbTabGroup: SbbTabGroup;
}

@Component({
  template: `
    <sbb-tab-group>
      @if (true) {
        <sbb-tab label="One">Tab one content</sbb-tab>
        <sbb-tab label="Two">Tab two content</sbb-tab>
      }
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class TabGroupWithIndirectDescendantTabs {
  @ViewChild(SbbTabGroup) tabGroup: SbbTabGroup;
}

@Component({
  template: `
    <div style="height: 300px; background-color: aqua">Top Content here</div>
    <sbb-tab-group>
      <ng-container>
        <sbb-tab label="One">
          <div style="height: 3000px; background-color: red"></div>
        </sbb-tab>
        <sbb-tab label="Two">
          <div style="height: 3000px; background-color: green"></div>
        </sbb-tab>
      </ng-container>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class TabGroupWithSpaceAbove {
  @ViewChild(SbbTabGroup) tabGroup: SbbTabGroup;
}

@Component({
  template: `
    <sbb-tab-group>
      <sbb-tab label="Parent 1">
        <sbb-tab-group>
          <sbb-tab label="Child 1">Content 1</sbb-tab>
          <sbb-tab>
            <ng-template sbb-tab-label>Child 2</ng-template>
            Content 2
          </sbb-tab>
          <sbb-tab label="Child 3">Child 3</sbb-tab>
        </sbb-tab-group>
      </sbb-tab>
      <sbb-tab label="Parent 2">Parent 2</sbb-tab>
      <sbb-tab label="Parent 3">Parent 3</sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class NestedTabGroupWithLabel {}

@Component({
  template: `
    <sbb-tab-group class="tab-group">
      <sbb-tab label="Tab One" [labelClass]="labelClassList" [bodyClass]="bodyClassList">
        Tab one content
      </sbb-tab>
      <sbb-tab label="Tab Two" labelClass="hardcoded-label-class" bodyClass="hardcoded-body-class">
        Tab two content
      </sbb-tab>
    </sbb-tab-group>
  `,
  standalone: true,
  imports: [SbbTabsModule],
})
class TabsWithClassesTestApp {
  labelClassList?: string | string[];
  bodyClassList?: string | string[];
}

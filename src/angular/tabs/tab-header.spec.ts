import { Direction, Directionality } from '@angular/cdk/bidi';
import { END, ENTER, HOME, LEFT_ARROW, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import { MutationObserverFactory, ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule, ViewportRuler } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  createKeyboardEvent,
  createMouseEvent,
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
} from '@sbb-esta/angular/core/testing';
import { Subject } from 'rxjs';

import { SbbTabHeader } from './tab-header';
import { SbbTabLabelWrapper } from './tab-label-wrapper';

describe('SbbTabHeader', () => {
  let dir: Direction = 'ltr';
  const change = new Subject();
  let fixture: ComponentFixture<SimpleTabHeaderApp>;
  let appComponent: SimpleTabHeaderApp;

  beforeEach(
    waitForAsync(() => {
      dir = 'ltr';
      TestBed.configureTestingModule({
        imports: [CommonModule, PortalModule, ScrollingModule, ObserversModule],
        declarations: [SbbTabHeader, SbbTabLabelWrapper, SimpleTabHeaderApp],
        providers: [
          ViewportRuler,
          { provide: Directionality, useFactory: () => ({ value: dir, change: change }) },
        ],
      });

      TestBed.compileComponents();
    })
  );

  describe('focusing', () => {
    let tabListContainer: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTabHeaderApp);
      fixture.detectChanges();

      appComponent = fixture.componentInstance;
      tabListContainer = appComponent.tabHeader._tabListContainer.nativeElement;
    });

    it('should initialize to the selected index', () => {
      // Recreate the fixture so we can test that it works with a non-default selected index
      fixture.destroy();
      fixture = TestBed.createComponent(SimpleTabHeaderApp);
      fixture.componentInstance.selectedIndex = 1;
      fixture.detectChanges();
      appComponent = fixture.componentInstance;
      tabListContainer = appComponent.tabHeader._tabListContainer.nativeElement;

      expect(appComponent.tabHeader.focusIndex).toBe(1);
    });

    it('should send focus change event', () => {
      appComponent.tabHeader.focusIndex = 2;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(2);
    });

    it('should not set focus a disabled tab', () => {
      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      // Set focus on the disabled tab, but focus should remain 0
      appComponent.tabHeader.focusIndex = appComponent.disabledTabIndex;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);
    });

    it('should move focus right and skip disabled tabs', () => {
      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      // Move focus right, verify that the disabled tab is 1 and should be skipped
      expect(appComponent.disabledTabIndex).toBe(1);
      dispatchKeyboardEvent(tabListContainer, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(2);

      // Move focus right to index 3
      dispatchKeyboardEvent(tabListContainer, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(3);
    });

    it('should move focus left and skip disabled tabs', () => {
      appComponent.tabHeader.focusIndex = 3;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(3);

      // Move focus left to index 3
      dispatchKeyboardEvent(tabListContainer, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(2);

      // Move focus left, verify that the disabled tab is 1 and should be skipped
      expect(appComponent.disabledTabIndex).toBe(1);
      dispatchKeyboardEvent(tabListContainer, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);
    });

    it('should support key down events to move and select focus', () => {
      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      // Move focus right to 2
      dispatchKeyboardEvent(tabListContainer, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(2);

      // Select the focused index 2
      expect(appComponent.selectedIndex).toBe(0);
      const enterEvent = dispatchKeyboardEvent(tabListContainer, 'keydown', ENTER);
      fixture.detectChanges();
      expect(appComponent.selectedIndex).toBe(2);
      expect(enterEvent.defaultPrevented).toBe(true);

      // Move focus right to 0
      dispatchKeyboardEvent(tabListContainer, 'keydown', LEFT_ARROW);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      // Select the focused 0 using space.
      expect(appComponent.selectedIndex).toBe(2);
      const spaceEvent = dispatchKeyboardEvent(tabListContainer, 'keydown', SPACE);
      fixture.detectChanges();
      expect(appComponent.selectedIndex).toBe(0);
      expect(spaceEvent.defaultPrevented).toBe(true);
    });

    it('should not prevent the default space/enter action if the current is selected', () => {
      appComponent.tabHeader.focusIndex = appComponent.tabHeader.selectedIndex = 0;
      fixture.detectChanges();

      const spaceEvent = dispatchKeyboardEvent(tabListContainer, 'keydown', SPACE);
      fixture.detectChanges();
      expect(spaceEvent.defaultPrevented).toBe(false);

      const enterEvent = dispatchKeyboardEvent(tabListContainer, 'keydown', ENTER);
      fixture.detectChanges();
      expect(enterEvent.defaultPrevented).toBe(false);
    });

    it('should move focus to the first tab when pressing HOME', () => {
      appComponent.tabHeader.focusIndex = 3;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(3);

      const event = dispatchKeyboardEvent(tabListContainer, 'keydown', HOME);
      fixture.detectChanges();

      expect(appComponent.tabHeader.focusIndex).toBe(0);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should skip disabled items when moving focus using HOME', () => {
      appComponent.tabHeader.focusIndex = 3;
      appComponent.tabs[0].disabled = true;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(3);

      dispatchKeyboardEvent(tabListContainer, 'keydown', HOME);
      fixture.detectChanges();

      // Note that the second tab is disabled by default already.
      expect(appComponent.tabHeader.focusIndex).toBe(2);
    });

    it('should move focus to the last tab when pressing END', () => {
      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      const event = dispatchKeyboardEvent(tabListContainer, 'keydown', END);
      fixture.detectChanges();

      expect(appComponent.tabHeader.focusIndex).toBe(3);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should skip disabled items when moving focus using END', () => {
      appComponent.tabHeader.focusIndex = 0;
      appComponent.tabs[3].disabled = true;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      dispatchKeyboardEvent(tabListContainer, 'keydown', END);
      fixture.detectChanges();

      expect(appComponent.tabHeader.focusIndex).toBe(2);
    });

    it('should not do anything if a modifier key is pressed', () => {
      const rightArrowEvent = createKeyboardEvent('keydown', RIGHT_ARROW, undefined, {
        shift: true,
      });
      const enterEvent = createKeyboardEvent('keydown', ENTER, undefined, { shift: true });

      appComponent.tabHeader.focusIndex = 0;
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);

      dispatchEvent(tabListContainer, rightArrowEvent);
      fixture.detectChanges();
      expect(appComponent.tabHeader.focusIndex).toBe(0);
      expect(rightArrowEvent.defaultPrevented).toBe(false);

      expect(appComponent.selectedIndex).toBe(0);
      dispatchEvent(tabListContainer, enterEvent);
      fixture.detectChanges();
      expect(appComponent.selectedIndex).toBe(0);
      expect(enterEvent.defaultPrevented).toBe(false);
    });
  });

  describe('pagination', () => {
    // TODO
  });
});

interface Tab {
  label: string;
  disabled?: boolean;
}

@Component({
  template: `
    <div [dir]="dir">
      <sbb-tab-header
        [selectedIndex]="selectedIndex"
        (indexFocused)="focusedIndex = $event"
        (selectFocusedIndex)="selectedIndex = $event"
      >
        <div
          sbbTabLabelWrapper
          class="label-content"
          style="min-width: 30px; width: 30px"
          *ngFor="let tab of tabs; let i = index"
          [disabled]="!!tab.disabled"
          (click)="selectedIndex = i"
        >
          {{ tab.label }}
        </div>
      </sbb-tab-header>
    </div>
  `,
  styles: [
    `
      :host {
        width: 130px;
      }
    `,
  ],
})
class SimpleTabHeaderApp {
  selectedIndex: number = 0;
  focusedIndex: number;
  disabledTabIndex = 1;
  tabs: Tab[] = [
    { label: 'tab one' },
    { label: 'tab one' },
    { label: 'tab one' },
    { label: 'tab one' },
  ];
  dir: Direction = 'ltr';

  @ViewChild(SbbTabHeader, { static: true }) tabHeader: SbbTabHeader;

  constructor() {
    this.tabs[this.disabledTabIndex].disabled = true;
  }

  addTabsForScrolling(amount = 4) {
    for (let i = 0; i < amount; i++) {
      this.tabs.push({ label: 'new' });
    }
  }
}

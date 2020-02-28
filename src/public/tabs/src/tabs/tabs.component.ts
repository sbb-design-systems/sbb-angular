import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { merge, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TabComponent } from '../tab/tab.component';

let counter = 0;

@Component({
  selector: 'sbb-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements AfterContentInit, OnDestroy {
  /** @docs-private */
  @HostBinding('class.sbb-tabs') _tabsClass = true;
  /** Class property that tracks tab number of the list */
  nameOfTabList = `sbb-tabs-${counter++}`;
  /** Index of tab list */
  tabListIndex = 0;
  /** Class property that tracks changes in the tabs contained in the list */
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  /** Class property that tracks changes in the content tab in the list of tab */
  tabs$: Observable<TabComponent[]>;
  /** Class property that tracks changes in the label tab in the list of tab */
  @ViewChildren('label') labels: QueryList<ElementRef>;
  /** Emits the newly selected  */
  @Output() selectedIndexChange = new EventEmitter<number>();
  /**
   * Class property that records an event on tabs
   */
  private _tabsSubscription = Subscription.EMPTY;
  /**
   * Option keys available to move between tabs
   */
  private _allowedKeyCodes = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW, TAB];

  constructor(
    /** * Class property that manages different events */
    public componentFactoryResolver: ComponentFactoryResolver,
    /**
     * Class property that refers to the component object
     */
    public elementRef: ElementRef,
    private _changeDetector: ChangeDetectorRef
  ) {}

  ngAfterContentInit() {
    this.initTabs();

    this._tabsSubscription = this.tabs$
      .pipe(
        map(tabs => tabs.map(t => t._stateChanges)),
        switchMap(stateChanges => merge(...stateChanges))
      )
      .subscribe(() => this._changeDetector.markForCheck());
  }
  /**
   * Method that verifies the initial tabs state
   */
  initTabs() {
    this.tabs$ = merge<TabComponent[]>(of(this.tabs.toArray()), this.tabs.changes);

    const activeTabs = this.tabs.filter(tab => tab.active);

    if (activeTabs.length !== 1) {
      this.selectTab(this.tabs.first, true);
    }
  }
  /**
   * Method that destroys an event subscribed on tabs
   */
  ngOnDestroy() {
    this._tabsSubscription.unsubscribe();
  }
  /**
   * Method that recovers the first tab selected
   */
  openFirstTab() {
    this.tabListIndex = 0;
    this.selectTab(this.tabs.first);
  }
  /**
   * Method that recovers the tab selected by index
   */
  openTabByIndex(tabIndex: number) {
    const tabToSelect = this.tabs.toArray()[tabIndex];
    this.selectTab(tabToSelect);
  }
  /**
   * Method that selects the tab that matches with the tab in input
   */
  selectTab(tab: TabComponent, firstSelection = false) {
    // TODO: Check if there is a better solution for this timing issue
    Promise.resolve().then(() => {
      this.tabs.forEach((t, index) => {
        if (t.labelId === tab.labelId) {
          this.tabListIndex = index;
        }
        t.active = false;
        t.tabindex = -1;
        t.tabMarkForCheck();
      });

      tab.active = true;
      tab.tabindex = 0;
      tab.tabMarkForCheck();
      this._changeDetector.markForCheck();
      if (!firstSelection) {
        this.selectedIndexChange.emit(this.tabListIndex);
      }
    });
  }
  /**
   * Method that responds only to arrows and tab event
   */
  onKeyUp(event: any) {
    // respond only to arrows and tab
    if (this._allowedKeyCodes.indexOf(event.keyCode) !== -1) {
      if (event.keyCode === TAB) {
        this.tabListIndex = this.tabs.map(t => t.active).indexOf(true);
      } else {
        this._handleKeyUp(event.keyCode);
      }
    }
  }

  private _handleKeyUp(keyCode: number) {
    const tabLabels = this.labels.toArray();
    const hasReachEnd = this._handleKeyCodeReturnHasReachEnd(keyCode);
    const tabToFocus = tabLabels[this.tabListIndex];

    if (tabToFocus.nativeElement.disabled && !hasReachEnd) {
      // go to next
      this._handleKeyUp(keyCode);
    } else if (tabToFocus.nativeElement.disabled && hasReachEnd) {
      // reached end and no focusable tabs found. reverse direction to find a focusable one
      if (keyCode === LEFT_ARROW || keyCode === UP_ARROW) {
        this._handleKeyUp(RIGHT_ARROW);
      } else {
        this._handleKeyUp(LEFT_ARROW);
      }
    } else {
      tabLabels[this.tabListIndex].nativeElement.focus();
    }
  }

  private _handleKeyCodeReturnHasReachEnd(keyCode: number): boolean {
    switch (keyCode) {
      case LEFT_ARROW:
      case UP_ARROW:
        if (this.tabListIndex > 0) {
          this.tabListIndex -= 1;
          break;
        } else {
          return true;
        }

      case RIGHT_ARROW:
      case DOWN_ARROW:
        if (this.tabListIndex < this.tabs.length - 1) {
          this.tabListIndex += 1;
          break;
        } else {
          return true;
        }
    }

    return false;
  }
}

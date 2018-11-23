import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ComponentFactoryResolver,
  ElementRef,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  ViewEncapsulation,
  ViewChildren
} from '@angular/core';
import { LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW, TAB } from '@angular/cdk/keycodes';
import { Observable, merge, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TabComponent } from '../tab/tab.component';

let counter = 0;

@Component({
  selector: 'sbb-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TabsComponent implements AfterContentInit, OnDestroy {

  nameOfTabList = `sbb-tabs-${counter++}`;

  tabListIndex = 0;

  private allowedKeyCodes = [
    LEFT_ARROW,
    RIGHT_ARROW,
    UP_ARROW,
    DOWN_ARROW,
    TAB
  ];

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  tabs$: Observable<TabComponent[]>;

  @ViewChildren('label') labels: QueryList<ElementRef>;

  private _tabsSubscription = Subscription.EMPTY;

  constructor(public componentFactoryResolver: ComponentFactoryResolver,
    public elementRef: ElementRef,
    private _changeDetector: ChangeDetectorRef) { }

  ngAfterContentInit() {

    this.checkNumberOfTabs();

    this.initTabs();

    this._tabsSubscription = this.tabs$
      .pipe(
        map(tabs => tabs.map(t => t._stateChanges)),
        switchMap(stateChanges => merge(...stateChanges)))
      .subscribe(() => this._changeDetector.markForCheck());

  }

  initTabs() {
    this.tabs$ = merge<TabComponent[]>(of(this.tabs.toArray()), this.tabs.changes);

    const activeTabs = this.tabs.filter(tab => tab.active);

    if (activeTabs.length !== 1) {
      this.selectTab(this.tabs.first);
    }
  }

  ngOnDestroy() {
    this._tabsSubscription.unsubscribe();
  }

  openFirstTab() {
    this.tabListIndex = 0;
    this.selectTab(this.tabs.first);
  }

  openTabByIndex(tabIndex: number) {
    const tabToSelect = this.tabs.toArray()[tabIndex];
    this.selectTab(tabToSelect);
  }

  selectTab(tab: TabComponent) {
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
  }

  onKeyUp(event) {
    // respond only to arrows and tab
    if (this.allowedKeyCodes.indexOf(event.keyCode) !== -1) {
      if (event.keyCode === TAB) {
        this.tabListIndex = this.labels.toArray().findIndex(l => l.nativeElement.tabIndex === 0);
      } else {
        this.handleKeyDown(event.keyCode);
      }
    }
  }

  private handleKeyDown(keyCode) {
    const tabLabels = this.labels.toArray();
    const hasReachEnd = this.handleKeyCodeReturnHasReachEnd(keyCode);
    const tabToFocus = tabLabels[this.tabListIndex];

    if (tabToFocus.nativeElement.disabled && !hasReachEnd) {
      // go to next
      this.handleKeyDown(keyCode);
    } else if (tabToFocus.nativeElement.disabled && hasReachEnd) {
      // reached end and no focusable tabs found. reverse direction to find a focusable one
      if (keyCode === LEFT_ARROW || keyCode === UP_ARROW) {
        this.handleKeyDown(RIGHT_ARROW);
      } else {
        this.handleKeyDown(LEFT_ARROW);
      }
    } else {
      tabLabels[this.tabListIndex].nativeElement.focus();
    }

  }

  private handleKeyCodeReturnHasReachEnd(keyCode) {
    let hasReachEnd = false;

    switch (keyCode) {
      case LEFT_ARROW:
      case UP_ARROW:
        if (this.tabListIndex > 0) {
          this.tabListIndex -= 1;
        } else {
          hasReachEnd = true;
        }
        break;

      case RIGHT_ARROW:
      case DOWN_ARROW:
        if (this.tabListIndex < this.tabs.length - 1) {
          this.tabListIndex += 1;
        } else {
          hasReachEnd = true;
        }
        break;

      default:
        this.tabListIndex = this.tabListIndex;
    }

    return hasReachEnd;
  }

  private checkNumberOfTabs(): void {
    if (this.tabs.length < 2) {
      throw new Error(`The number of tabs must be at least 2`);
    }
  }

}

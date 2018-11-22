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
import { ENTER, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
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
    DOWN_ARROW
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

  onKeydown(event) {
    if (this.allowedKeyCodes.indexOf(event.keyCode) !== -1) {
      this.handleKeyDown(event.keyCode);
    }
  }

  private handleKeyDown(keyCode) {
    const tabLabels = this.labels.toArray();

    this.handleKeyCode(keyCode);

    const tabToFocus = tabLabels[this.tabListIndex];

    if (tabToFocus.nativeElement.disabled) {
      // go to next
      this.handleKeyDown(keyCode);
    } else {
      tabLabels[this.tabListIndex].nativeElement.focus();
    }

  }

  private handleKeyCode(keyCode) {
    switch (keyCode) {
      case LEFT_ARROW:
      case UP_ARROW:
        this.tabListIndex = (this.tabListIndex !== 0)
          ? this.tabListIndex -= 1
          : this.tabListIndex;
        break;

      case RIGHT_ARROW:
      case DOWN_ARROW:
        this.tabListIndex = (this.tabListIndex < this.tabs.length - 1)
          ? this.tabListIndex += 1
          : this.tabListIndex;
        break;

      default:
        this.tabListIndex = this.tabListIndex;
    }
  }

  private checkNumberOfTabs(): void {
    if (this.tabs.length < 2) {
      throw new Error(`The number of tabs must be at least 2`);
    }
  }

}

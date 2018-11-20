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
  ViewEncapsulation
} from '@angular/core';
import { ENTER, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
import { Observable, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

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

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  tabs$: Observable<TabComponent[]>;

  /** Subscription to changes in the tab. */
  private _tabSubscription = Subscription.EMPTY;

  /** Subscription to tabs being added/removed. */
  private _tabsSubscription = Subscription.EMPTY;

  constructor(public componentFactoryResolver: ComponentFactoryResolver,
    public elementRef: ElementRef,
    private _changeDetector: ChangeDetectorRef) { }

  ngAfterContentInit() {
    // 1) check the number of tabs ...
    this.checkNumberOfTabs();

    this.initTabs();

    this._tabsSubscription = this.tabs.changes.subscribe(() => {
      this.checkNumberOfTabs();
      this._subscribeToTabChange();
    });

    this._subscribeToTabChange();
  }

  initTabs() {
    this.tabs$ = merge<TabComponent[]>(of(this.tabs.toArray()), this.tabs.changes).pipe(map(tabs => tabs.map(tab => tab)));

    const activeTabs = this.tabs.filter(tab => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  ngOnDestroy() {
    this._tabSubscription.unsubscribe();
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
    // tslint:disable-next-line
    this.tabs.toArray().forEach(tab => (tab.active = false));
    tab.active = true;
    tab.tabindex = 0;

    this.tabs.forEach((_tab, index) => {
      if (_tab.labelId === tab.labelId) {
        this.tabListIndex = index;
      }
    });

    tab.tabMarkForCheck();
  }

  onKeydown(event) {
    if (event.keyCode === ENTER) {
      const tab = this.tabs.toArray()[this.tabListIndex];
      this.selectTab(tab);
    }
    if (event.keyCode === LEFT_ARROW || event.keyCode === UP_ARROW) {
      if (this.tabListIndex !== 0) {
        this.tabListIndex--;
      }
      const tab = this.tabs.toArray()[this.tabListIndex];
      const element = document.getElementById(tab.labelId) as HTMLElement;
      element.focus();
    }
    if (event.keyCode === RIGHT_ARROW || event.keyCode === DOWN_ARROW) {
      if (this.tabListIndex !== this.tabs.length - 1) {
        this.tabListIndex++;
      }
      const tab = this.tabs.toArray()[this.tabListIndex];
      const element = document.getElementById(tab.labelId) as HTMLElement;
      element.focus();
    }
  }

  private checkNumberOfTabs(): void {
    if (this.tabs.length < 2) {
      throw new Error(`The number of tabs must be at least 2`);
    }
  }

  private _subscribeToTabChange() {
    this._tabSubscription = merge(...this.tabs.map(tab => tab._stateChanges))
      .subscribe(() => {
        this._changeDetector.markForCheck();
      });
  }

}

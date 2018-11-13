import { Component,
         ContentChildren,
         QueryList,
         AfterContentInit,
         ComponentFactoryResolver,
         ElementRef } from '@angular/core';
import { ENTER, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW, TAB } from '@angular/cdk/keycodes';
import { TabComponent } from '../tab/tab.component';

let counter = 0;

@Component({
  selector: 'sbb-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {

  nameOfTabList = `sbb-tabs-${counter++}`;

  tabListIndex = 0;

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @ContentChildren(TabsComponent) tabModules: QueryList<TabsComponent>;

  constructor(public componentFactoryResolver: ComponentFactoryResolver, public elementRef: ElementRef) {}

  ngAfterContentInit() {
    // 1) check the number of tabs ...
    this.checkNumberOfTabs();
    // 2) check the number of badge pills per tab ...
    this.checkNumberOfBadgePillsPerTab();
    // 3) check the number of tab modules ...
    this.checkNumberOfTabModules();
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
        this.selectTab(this.tabs.first);
    }
  }

  onKeydown(event) {
    if(event.keyCode === ENTER) {
       /* do nothing */
    }
    if(event.keyCode === TAB) {
       /* do nothing */
    }
    if(event.keyCode === LEFT_ARROW || event.keyCode === UP_ARROW) {
       if(this.tabListIndex === 0) {
          /* do nothing */
       } else {
          this.tabListIndex--;
       }
       const tab     = this.tabs.toArray()[this.tabListIndex];
       const element = document.getElementById(tab.labelId) as HTMLElement;
       element.focus();
    }
    if(event.keyCode === RIGHT_ARROW || event.keyCode === DOWN_ARROW) {
       if(this.tabListIndex === this.tabs.length-1) {
          /* do nothing */
       } else {
          this.tabListIndex++;
       }
       const tab     = this.tabs.toArray()[this.tabListIndex];
       const element = document.getElementById(tab.labelId) as HTMLElement;
       element.focus();
    }
  }

  private checkNumberOfTabModules() : void {
    if(this.tabModules.length > 1) {
       throw new Error(`
          Another tab module within a register is not allowed.
          Ex: <sbb-tabs><sbb-tab><sbb-tabs> ... </sbb-tabs></sbb-tab></sbb-tabs>
       `);
    }
  }

  private checkNumberOfTabs() : void {
    if(this.tabs.length < 2) {
       throw new Error(`The number of tabs must be at least 2`);
    }
  }

  private checkNumberOfBadgePillsPerTab() : void {
    const tabsWithBadgePills = this.tabs.filter(tab => tab.badgePill < 0 || tab.badgePill > 999);
    if (tabsWithBadgePills.length > 0) {
        throw new Error(`The quantity indicator should contains only numbers with a maximum of 3 digits (0-999)`);
    }
  }

  openFirstTab() {
    this.tabListIndex = 0;
    this.selectTab(this.tabs.first);
  }

  selectTab(tab: TabComponent) {
    // tslint:disable-next-line
    this.tabs.toArray().forEach(tab => (tab.active = false));
    tab.active = true;
    for(let i = 0; i < this.tabs.toArray().length; i++) {
        const _tab = this.tabs.toArray()[i];
        if(_tab.labelId === tab.labelId) {
           this.tabListIndex = i;
       }
    }
  }
}

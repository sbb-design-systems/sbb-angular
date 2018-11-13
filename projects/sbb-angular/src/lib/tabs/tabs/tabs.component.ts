import { Component,
         ContentChildren,
         QueryList,
         AfterContentInit,
         ComponentFactoryResolver } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

let counter = 0;

@Component({
  selector: 'sbb-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {

  nameOfTabList = `sbb-tabs-${counter++}`;

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @ContentChildren(TabsComponent) tabModules: QueryList<TabsComponent>;

  constructor(public componentFactoryResolver: ComponentFactoryResolver) {}

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
    this.selectTab(this.tabs.first);
  }

  selectTab(tab: TabComponent) {
    // tslint:disable-next-line
    this.tabs.toArray().forEach(tab => (tab.active = false));
    tab.active = true;
  }
}

import { Component,
         ContentChildren,
         QueryList,
         AfterContentInit,
         ViewChild,
         ComponentFactoryResolver,
         ViewContainerRef
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'sbb-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {

  dynamicTabs: TabComponent[] = [];

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @ContentChildren(TabsComponent) tabModules: QueryList<TabsComponent>;

  @ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterContentInit() {
    // 1) check the number of tab modules ...
    this.checkNumberOfTabModules();
    // 2) check the number of tabs ...
    this.checkNumberOfTabs();
    // 3) check the number of badge pills per tab ...
    this.checkNumberOfBadgePillsPerTab();
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
    const counter = this.tabs.length + this.dynamicTabs.length;
    if(counter < 2) {
       throw new Error(`The number of tabs must be at least 2`);
    }
  }

  private checkNumberOfBadgePillsPerTab() : void {
    const tabsWithBadgePills = this.tabs.filter(tab => tab.badgePill < 0 || tab.badgePill > 999);
    if (tabsWithBadgePills.length > 0) {
        this.throwBadgePillsError();
    }
    const dynamicsTabsWithBadgePills = this.dynamicTabs.filter(tab => tab.badgePill < 0 || tab.badgePill > 999);
    if (dynamicsTabsWithBadgePills.length > 0) {
        this.throwBadgePillsError();
    }
  }

  private throwBadgePillsError(): void {
    throw new Error(`The quantity indicator should contains only numbers with a maximum of 3 digits (0-999)`);
  }

  openFirstTab() {
    this.selectTab(this.tabs.first);
  }

  openTab(tabTitle: string,
          template,
          data,
          isCloseable = false) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TabComponent);
    // tslint:disable-next-line
    let viewContainerRef = this.dynamicTabPlaceholder;
    const componentRef = viewContainerRef.createComponent(componentFactory);

    const instance: TabComponent = componentRef.instance as TabComponent;
    instance.tabTitle    = tabTitle;
    instance.template    = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    this.dynamicTabs.push(componentRef.instance as TabComponent);

    this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
  }

  selectTab(tab: TabComponent) {
    // tslint:disable-next-line
    this.tabs.toArray().forEach(tab => (tab.active = false));
    // tslint:disable-next-line
    this.dynamicTabs.forEach(tab => (tab.active = false));
    tab.active = true;
  }

  closeTab(tab: TabComponent) {
    for (let i = 0; i < this.dynamicTabs.length; i++) {
         if (this.dynamicTabs[i] === tab) {
             this.dynamicTabs.splice(i, 1);
             // tslint:disable-next-line
             let viewContainerRef = this.dynamicTabPlaceholder;
             viewContainerRef.remove(i);
             this.selectTab(this.tabs.last);
             break;
         }
    }
  }

  closeActiveTab() {
    const activeTabs = this.dynamicTabs.filter(tab => tab.active);
    if (activeTabs.length > 0) {
        this.closeTab(activeTabs[0]);
    }
  }
}

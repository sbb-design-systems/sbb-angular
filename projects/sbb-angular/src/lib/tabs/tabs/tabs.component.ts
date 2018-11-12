import { Component,
         ContentChildren,
         QueryList,
         AfterContentInit,
         ViewChild,
         ComponentFactoryResolver,
         ViewContainerRef
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

let counter = 0;

@Component({
  selector: 'sbb-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {

  nameOfTabList = `sbb-tabs-${counter++}`;

  dynamicTabs: TabComponent[] = [];

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @ContentChildren(TabsComponent) tabModules: QueryList<TabsComponent>;

  @ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;

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
    const sizeOfTabs = this.tabs.length + this.dynamicTabs.length;
    if(sizeOfTabs < 2) {
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

  getPrefixFromId(id : string) : string {
    return id.substring(0, id.indexOf('-'));
  }

  openFirstTab() {
    this.selectTab(this.tabs.first);
  }

  openTab(title: string,
          template,
          data,
          isCloseable = false) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TabComponent);
    // tslint:disable-next-line
    let viewContainerRef = this.dynamicTabPlaceholder;
    const componentRef = viewContainerRef.createComponent(componentFactory);

    const instance: TabComponent = componentRef.instance as TabComponent;
    instance.title = title;
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;
    instance.id = 'dynamic-tab';

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

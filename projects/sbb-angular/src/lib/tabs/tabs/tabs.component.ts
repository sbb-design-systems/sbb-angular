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

  @ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
        this.selectTab(this.tabs.first);
    }
  }

  openTab(tabTitle: string, template, data, isCloseable = false, badgePill: string) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TabComponent);
    let viewContainerRef = this.dynamicTabPlaceholder;
    const componentRef = viewContainerRef.createComponent(componentFactory);

    const instance: TabComponent = componentRef.instance as TabComponent;
    instance.tabTitle = tabTitle;
    instance.template = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;
    instance.badgePill = badgePill;

    this.dynamicTabs.push(componentRef.instance as TabComponent);

    this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
  }

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach(tab => (tab.active = false));
    this.dynamicTabs.forEach(tab => (tab.active = false));
    tab.active = true;
  }

  closeTab(tab: TabComponent) {
    for (let i = 0; i < this.dynamicTabs.length; i++) {
         if (this.dynamicTabs[i] === tab) {
             this.dynamicTabs.splice(i, 1);
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

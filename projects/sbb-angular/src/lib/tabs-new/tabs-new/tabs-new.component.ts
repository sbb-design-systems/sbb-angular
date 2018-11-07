import { Component,
         ContentChildren,
         QueryList,
         AfterContentInit,
         ViewChild,
         ComponentFactoryResolver,
         ViewContainerRef
} from '@angular/core';
import { TabNewComponent } from '../tab-new/tab-new.component';

let counter = 0;

@Component({
  selector: 'sbb-tabs-new',
  templateUrl: './tabs-new.component.html',
  styleUrls: ['./tabs-new.component.scss']
})
export class TabsNewComponent implements AfterContentInit {

  nameOfTabList = `sbb-tabs-new-${counter++}`;

  dynamicTabs: TabNewComponent[] = [];

  @ContentChildren(TabNewComponent) tabs: QueryList<TabNewComponent>;

  @ContentChildren(TabsNewComponent) tabModules: QueryList<TabsNewComponent>;

  @ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

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
    let counter = 1;
    this.tabs.forEach(tab => {
        console.log('tab ' + (counter++));
        console.log('---');
        console.log('tab.id', tab.id);
        console.log('tab.title', tab.title);
        console.log('tab.index', tab.index);
        console.log('tab.ariaLabelledby', tab.ariaLabelledby);
    });
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

  getPrefixFromId(id : string) : string{
    return id.substring(0, id.indexOf('-'));
  }

  openFirstTab() {
    this.selectTab(this.tabs.first);
  }

  openTab(title: string,
          template,
          data,
          isCloseable = false) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TabNewComponent);
    // tslint:disable-next-line
    let viewContainerRef = this.dynamicTabPlaceholder;
    const componentRef = viewContainerRef.createComponent(componentFactory);

    const instance: TabNewComponent = componentRef.instance as TabNewComponent;
    instance.title       = title;
    instance.template    = template;
    instance.dataContext = data;
    instance.isCloseable = isCloseable;

    this.dynamicTabs.push(componentRef.instance as TabNewComponent);

    this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
  }

  selectTab(tab: TabNewComponent) {
    // tslint:disable-next-line
    this.tabs.toArray().forEach(tab => (tab.active = false));
    // tslint:disable-next-line
    this.dynamicTabs.forEach(tab => (tab.active = false));
    tab.active = true;
  }

  closeTab(tab: TabNewComponent) {
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

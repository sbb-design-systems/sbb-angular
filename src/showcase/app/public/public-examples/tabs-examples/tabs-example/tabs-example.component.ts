import { Component, OnInit, ViewChild } from '@angular/core';
import { SbbTabs } from '@sbb-esta/angular-public/tabs';

export interface Person {
  id?: number;
  name: string;
  surname: string;
}

@Component({
  selector: 'sbb-tabs-example',
  styleUrls: ['./tabs-example.component.css'],
  templateUrl: './tabs-example.component.html',
})
export class TabsExampleComponent implements OnInit {
  @ViewChild('tabs', { static: true }) tabsComponent: SbbTabs;

  disabled = false;
  removed = false;

  dataSet = '1';
  data = ['1', '50', '550'];

  peopleInitialLoad: Person = { id: 1, name: 'Max', surname: 'Muster' };

  people: Person[] = [];

  peopleList: Person[] = [
    { name: 'Peter', surname: 'Hahn' },
    { name: 'Andreas', surname: 'Hofstetter' },
    { name: 'Paul', surname: 'Walker' },
    { name: 'Urs', surname: 'Fischer' },
    { name: 'Antonio', surname: 'Conte' },
    { name: 'Miriam', surname: 'Höller' },
    { name: 'Veronika', surname: 'Schmidt' },
    { name: 'Petra', surname: 'Ivanov' },
    { name: 'Alexandra', surname: 'Maurer' },
    { name: 'Adriana', surname: 'Lima' },
  ];

  ngOnInit() {
    this.people.push(this.peopleInitialLoad);
  }

  private _initialPersonArrayByAmount(amount: number): void {
    let counter = 0;
    while (counter < amount) {
      for (const item of this.peopleList) {
        counter++;
        this.people.push({
          id: counter,
          name: item.name,
          surname: item.surname,
        });
      }
    }
  }

  removeChange(removedTabId: string) {
    this.openPrevTabByTabIdOrDefault(removedTabId);
  }

  disableChange(disabledTabId: string) {
    this.openPrevTabByTabIdOrDefault(disabledTabId);
  }

  openPrevTabByTabIdOrDefault(tabId: string) {
    const tabsArray = this.tabsComponent.tabs.toArray();
    const activeTab = tabsArray.findIndex((currTab) => currTab.active);
    const selectedTabIndex = tabsArray.findIndex((tab) => tab.id === tabId);

    if (activeTab === selectedTabIndex) {
      if (selectedTabIndex > 0) {
        this.tabsComponent.openTabByIndex(selectedTabIndex - 1);
      } else {
        this.tabsComponent.openFirstTab();
      }
    }
  }

  onChangeOfDataSet(event: string) {
    this.people = [];
    if (event.startsWith('1')) {
      this.people.push(this.peopleInitialLoad);
    }
    if (event.startsWith('50')) {
      this._initialPersonArrayByAmount(50);
    }
    if (event.startsWith('550')) {
      this._initialPersonArrayByAmount(550);
    }
  }

  getPeopleCount(): number {
    return Object.keys(this.people).length;
  }
}

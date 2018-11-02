import { Component, ViewChild, OnInit } from '@angular/core';
import { TabsComponent } from 'sbb-angular';

@Component({
  selector: 'sbb-tabs-showcase',
  templateUrl: './tabs-showcase.component.html',
  styleUrls: ['./tabs-showcase.component.scss']
})
export class TabsShowcaseComponent implements OnInit {

  @ViewChild('personEdit') editPersonTemplate;
  @ViewChild(TabsComponent) tabsComponent;

  disabled: boolean;
  withDynamicTabs = true;
  tabType = 'with dynamic tabs';
  types = [
    'with dynamic tabs',
    'without dynamic tabs'
  ];

  dataSet = 'default (add data manually)';
  data = [
    'default (add data manually)',
    '500',
    '1000'
  ];

  personInitialLoad = {id: 1, name: 'Max', surname: 'Muster'};

  person = [];

  personList = [
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
    this.person.push(this.personInitialLoad);
  }

  onChangeOfType() {
    this.withDynamicTabs = !this.withDynamicTabs;
    this.tabsComponent.openFirstTab();
  }

  onChangeOfDataSet(event) {
    this.person = [];
    if(event.startsWith('default')) {
       this.person.push(this.personInitialLoad);
    }
    if(event.startsWith('500')) {
       let counter = 0;
       while(counter < 500) {
             for(const item of this.personList) {
                 counter++;
                 this.person.push({id: counter, name: item.name, surname: item.surname});
             }
       }
    }
    if(event.startsWith('1000')) {
       let counter = 0;
       while(counter < 1000) {
             for(const item of this.personList) {
                 counter++;
                 this.person.push({id: counter, name: item.name, surname: item.surname});
             }
       }
    }
  }

  getCountOfPerson() {
    return Object.keys(this.person).length;
  }

  onEditPerson(person) {
    this.tabsComponent.openTab(
      `Editing ${person.name}`,
      this.editPersonTemplate,
      person,
      true
    );
  }

  onAddPerson() {
    this.tabsComponent.openTab('New Person', this.editPersonTemplate, {}, true);
  }

  onPersonFormSubmit(dataModel) {
    if (dataModel.id > 0) {
      this.person = this.person.map(person => {
        if (person.id === dataModel.id) {
            return dataModel;
        } else {
            return person;
        }
      });
    } else {
      dataModel.id = this.person.length + 1;
      this.person.push(dataModel);
    }
    this.tabsComponent.closeActiveTab();
  }
}

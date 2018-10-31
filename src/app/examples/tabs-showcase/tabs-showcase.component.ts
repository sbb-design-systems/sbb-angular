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

  person = [
    {
      id: 1,
      name: 'Peter',
      surname: 'Muster'
    }
  ];

  ngOnInit() {
  }

  onChangeOfType(event) {
    console.log('event', event);
  }

  onChangeOfDataSet(event) {
    console.log('event', event);
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
      dataModel.id = Math.round(Math.random() * 100);
      this.person.push(dataModel);
    }
    this.tabsComponent.closeActiveTab();
  }
}

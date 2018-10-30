import { Component, ViewChild, OnInit } from '@angular/core';
import { TabsComponent } from 'sbb-angular';

@Component({
  selector: 'tabs-showcase',
  templateUrl: './tabs-showcase.component.html',
  styleUrls: ['./tabs-showcase.component.scss']
})
export class TabsShowcaseComponent implements OnInit {

  @ViewChild('personEdit') editPersonTemplate;
  @ViewChild(TabsComponent) tabsComponent;

  person = [
    {
      id: 1,
      name: 'Peter',
      surname: 'Pan'
    }
  ];

  ngOnInit() {
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

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

  disabled = false;
  removed = false;

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

  private initialPersonArrayByAmount(amount: number) : void {
    let counter = 0;
    while(counter < amount) {
          for(const item of this.personList) {
              counter++;
              this.person.push({id: counter, name: item.name, surname: item.surname});
          }
    }
  }

  setFirstTabIfDisabled() {
    if(this.disabled) {
       this.tabsComponent.openFirstTab();
    }
  }

  onChangeOfDataSet(event) {
    this.person = [];
    if(event.startsWith('default')) {
       this.person.push(this.personInitialLoad);
    }
    if(event.startsWith('500')) {
       this.initialPersonArrayByAmount(500);
    }
    if(event.startsWith('1000')) {
       this.initialPersonArrayByAmount(1000);
    }
  }

  checkValueForRemoveLastTab() {
    if(this.removed) {
       this.tabsComponent.openFirstTab();
    }
  }

  getCountOfPersons() : number {
    return Object.keys(this.person).length;
  }
}

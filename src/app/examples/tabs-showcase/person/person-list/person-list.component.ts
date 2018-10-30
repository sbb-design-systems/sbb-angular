import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent {
  @Input() person;
  @Output() addPerson = new EventEmitter<any>();
  @Output() editPerson = new EventEmitter<any>();
}

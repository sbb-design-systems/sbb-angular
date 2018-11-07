import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'person-list-new',
  templateUrl: './person-list-new.component.html',
  styleUrls: ['./person-list-new.component.scss']
})
export class PersonListNewComponent {
  @Input() person;
  @Output() addPerson = new EventEmitter<any>();
  @Output() editPerson = new EventEmitter<any>();
}

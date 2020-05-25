import { Component, Input } from '@angular/core';

import { Person } from '../tabs-example.component';

@Component({
  selector: 'sbb-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css'],
})
export class PeopleListComponent {
  @Input() people: Person[] = [];
}

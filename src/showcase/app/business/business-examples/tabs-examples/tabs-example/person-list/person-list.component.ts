import { Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent {
  @Input() person: any;
}

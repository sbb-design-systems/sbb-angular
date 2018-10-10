import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-events',
  templateUrl: './documentation-events-input-field.component.html',
  styleUrls: ['./documentation-events-input-field.component.scss']
})
export class DocumentationEventsInputFieldComponent implements OnInit {

  eventsText = 'Events goes here ...';

  constructor() {
  }

  ngOnInit() {
  }

}

import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-properties',
  templateUrl: './documentation-properties-input-field.component.html',
  styleUrls: ['./documentation-properties-input-field.component.scss']
})
export class DocumentationPropertiesInputFieldComponent implements OnInit {

  propertiesText = 'Below are the attributes for the input :';

  constructor() {
  }

  ngOnInit() {
  }

}

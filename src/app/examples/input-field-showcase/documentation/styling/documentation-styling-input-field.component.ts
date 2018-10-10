import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-styling',
  templateUrl: './documentation-styling-input-field.component.html',
  styleUrls: ['./documentation-styling-input-field.component.scss']
})
export class DocumentationStylingInputFieldComponent implements OnInit {

  stylingText = 'Styling goes here ...';

  constructor() {
  }

  ngOnInit() {
  }

}

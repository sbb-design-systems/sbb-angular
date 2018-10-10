import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-auto-resize',
  templateUrl: './documentation-auto-resize-input-field.component.html',
  styleUrls: ['./documentation-auto-resize-input-field.component.scss']
})
export class DocumentationAutoResizeInputFieldComponent implements OnInit {

  autoResizeText = 'Auto resize goes here ...';

  constructor() {
  }

  ngOnInit() {
  }

}

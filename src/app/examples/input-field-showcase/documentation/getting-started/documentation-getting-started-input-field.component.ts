import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-getting-started',
  templateUrl: './documentation-getting-started-input-field.component.html',
  styleUrls: ['./documentation-getting-started-input-field.component.scss']
})
export class DocumentationGettingStartedInputFieldComponent implements OnInit {

  gettingStartedText = '<b>sbb-input-field</b> is used as follows :';

  options = { theme: 'default', language: 'html', readOnly: true, automaticLayout: true };

  codeGettingStarted = `<sbb-input-field inputType="text" placeholder="Placeholder" pattern="myPatternGoesHere"></sbb-input-field>`;

  constructor() {
  }

  ngOnInit() {
  }

}

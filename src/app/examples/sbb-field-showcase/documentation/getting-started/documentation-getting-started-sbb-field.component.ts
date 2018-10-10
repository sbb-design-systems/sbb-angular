import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-field-showcase-documentation-getting-started',
  templateUrl: './documentation-getting-started-sbb-field.component.html',
  styleUrls: ['./documentation-getting-started-sbb-field.component.scss']
})
export class DocumentationGettingStartedSbbFieldComponent implements OnInit {

  gettingStartedText = '<b>sbb-field</b> is applied to a label and an input field :';

  options = { theme: 'default', language: 'html', readOnly: true, automaticLayout: true };

  codeGettingStarted = `
  <sbb-field for="name" label="Name"></sbb-field>
  <input type="text" formControlName="name" required placeholder="Please enter your name ..." id="name" spellcheck="false">`;

  constructor() {
  }

  ngOnInit() {
  }

}

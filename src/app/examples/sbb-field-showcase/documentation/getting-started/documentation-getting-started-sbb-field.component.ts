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
<form autocomplete="off" [formGroup]="myForm">
  <sbb-field>
    <div class="form-group">
      <sbb-label for="name" label="Name"></sbb-label>
      <input type="text"
             formControlName="name"
             required
             (keyup)="onKeyEnter1($event)"
             class="form-control"
             placeholder="Please enter your name ..."
             id="name"
             spellcheck="false">
    </div>
    <div class="form-group">
      <h6>Model:</h6>
      <pre>{{ valueFromInput | json }}</pre>
      <sbb-form-error *ngIf="myForm.get('name').errors?.required" errorMsg="Name is required!"></sbb-form-error>
    </div>
  </sbb-field>
</form>`;

  constructor() {
  }

  ngOnInit() {
  }

}

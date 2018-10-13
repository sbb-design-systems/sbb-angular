import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-source',
  templateUrl: './documentation-source-input-field.component.html',
  styleUrls: ['./documentation-source-input-field.component.scss']
})
export class DocumentationSourceInputFieldComponent implements OnInit {

  sourceHTMLHeader = '1. Source Code of <b>InputFieldShowcase</b> in HTML as follows :';

  sourceHTML = `<div class="conatiner">
  <div class="row justify-content-between">
     <div class="col-6">
      <legend>Input Field</legend>
      <fieldset>
        <div class="form-group">
          <sbb-input-field>
            <input [type]="inputType"
                   [placeholder]="placeholder"
                    autocomplete="off"
                   [readonly]="readonly"
                   [disabled]="disabled"
                   [(ngModel)]="inputText"
                   style="width : 100%">
          </sbb-input-field>
        </div>
        <div class="form-group">
          <h6>Model:</h6>
          <pre>{{ inputText | json }}</pre>
        </div>
      </fieldset>
     </div>
     <div class="col-lg-6">
      <legend>Properties</legend>
      <fieldset>
        <div class="form-group">
          <label>Bitte wählen Sie :</label>
          <select [(ngModel)]="inputType" class="form-control" (ngModelChange)="onChange($event)">
            <option *ngFor="let type of types" [ngValue]="type">{{ type }}</option>
          </select>
        </div>
        <div class="form-check">
          <input id="disabled" class="form-check-input" type="checkbox" [(ngModel)]="disabled">
          <label class="form-check-label" for="disabled">Disabled</label>
        </div>
        <div class="form-check" *ngIf="inputType !== 'file'">
          <input id="readonly" class="form-check-input" type="checkbox" [(ngModel)]="readonly">
          <label class="form-check-label" for="readonly">Readonly</label>
        </div>
      </fieldset>
     </div>
  </div>
</div>`;

  sourceTSHeader = '2. Source Code of <b>InputFieldShowcase</b> in TypeScript as follows :';

  sourceTS = `import { Component, OnInit } from '@angular/core';

  @Component({
    selector: 'sbb-input-field-showcase',
    templateUrl: './input-field-showcase.component.html',
    styleUrls: ['./input-field-showcase.component.scss']
  })
  export class InputFieldShowcaseComponent implements OnInit {

    inputText = '';
    disabled: boolean;
    required: boolean;
    isVisible = true;
    readonly: boolean;
    inputType = 'text';
    placeholder = 'Ihre Eingabe ...';
    types = [
      'text',
      'password',
      'number',
      'file',
      'email',
      'datetime',
      'datetime-local'
    ];

    ngOnInit() {
    }

    onChange(event) {
      if(event == 'text') {
         this.placeholder = 'Ihre Eingabe ...';
      }
      if(event == 'password') {
         this.placeholder = 'Ihr Passwort ...';
      }
      if(event == 'number') {
         this.placeholder = 'Ihre Number ...';
      }
      if(event == 'email') {
        this.placeholder = 'Ihre eMail ...';
      }
      if(event == 'datetime') {
        this.placeholder = 'Ihre Datum ...';
      }
    }

  }`;

  optionsForHTML = { theme: 'default', language: 'html', readOnly: true, automaticLayout: true };
  optionsForTS = { theme: 'default', language: 'typescript', readOnly: true, automaticLayout: true };

  constructor() {
  }

  ngOnInit() {
  }

}

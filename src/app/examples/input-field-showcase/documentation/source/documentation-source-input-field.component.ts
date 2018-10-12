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
        <h6>1. Password Input Field</h6>
        <hr/>
        <sbb-input-field>
          <input type="password" placeholder="Placeholder" autocomplete="off">
        </sbb-input-field>
     </div>
     <div class="col-6">
        <h6>2. Text Input Field</h6>
        <hr/>
        <sbb-input-field>
          <input type="text" placeholder="Placeholder" autocomplete="off">
        </sbb-input-field>
     </div>
  </div>
  <hr/>
  <div class="row justify-content-between">
      <div class="col-6">
         <h6>3. Password Input Field (disabled)</h6>
         <hr/>
         <sbb-input-field>
           <input type="password" placeholder="Placeholder" disabled="true" autocomplete="off">
         </sbb-input-field>
      </div>
      <div class="col-6">
         <h6>4. Text Input Field (disabled)</h6>
         <hr/>
         <sbb-input-field>
           <input type="text" placeholder="Placeholder" disabled="true" autocomplete="off">
         </sbb-input-field>
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

    ngOnInit() {
    }

  }`;

  optionsForHTML = { theme: 'default', language: 'html', readOnly: true, automaticLayout: true };
  optionsForTS = { theme: 'default', language: 'typescript', readOnly: true, automaticLayout: true };

  constructor() {
  }

  ngOnInit() {
  }

}

import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'sbb-field-showcase-documentation-source',
  templateUrl: './documentation-source-sbb-field.component.html',
  styleUrls: ['./documentation-source-sbb-field.component.scss']
})
export class DocumentationSourceSbbFieldComponent implements OnInit {

  sourceHTMLHeader = '1. Source Code of <b>SBBFieldShowcase</b> in HTML as follows :';

  sourceHTML = `<div class="conatiner">
  <div class="row justify-content-between">  
     <div class="col-6">
        <h6>1. Label with Input</h6> 
        <hr/>
        <form autocomplete="off" [formGroup]="myForm1">
          <div class="form-group">
            <sbb-field for="name1" label="Name"></sbb-field>
            <input type="text" formControlName="name1" required (keyup)="onKeyEnter1($event)" class="form-control" placeholder="Please enter your name ..." id="name1" spellcheck="false">
          </div>
          <div class="form-group">Chars : {{ valueFromInput1 }}</div>
          <div class="form-group">
              <sbb-form-error *ngIf="myForm1.get('name1').errors?.required" errorMsg="Name is required!">
              </sbb-form-error>
          </div>
        </form>
     </div>
     <div class="col-6">
        <h6>2. Label with optional Text, Tooltip and Input</h6>
        <hr/>
        <form autocomplete="off" [formGroup]="myForm2">
          <div class="form-group">
            <sbb-field for="name2" label="Name" optional="With optional Text" toolTip="Here comes the Tooltip"></sbb-field>
            <input type="text" formControlName="name2" (keyup)="onKeyEnter2($event)" class="form-control" placeholder="Please enter your name ..." id="name2" spellcheck="false" required minlength="3">
          </div>
          <div class="form-group">Chars : {{ valueFromInput2 }}</div>
          <div class="form-group">
              <sbb-form-error *ngIf="myForm2.get('name2').errors?.required" errorMsg="Name is required!">
              </sbb-form-error>
              <sbb-form-error *ngIf="myForm2.get('name2').errors?.minlength" errorMsg="Name must contain at least 3 characters!">
              </sbb-form-error>
          </div>
        </form>  
      </div>
  </div>
</div>`;

  sourceTSHeader = '2. Source Code of <b>SBBFieldShowcase</b> in TypeScript as follows :';

  sourceTS = `import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  
  @Component({
    selector: 'sbb-field-showcase',
    templateUrl: './text-field-showcase.component.html',
    styleUrls: ['./text-field-showcase.component.scss']
  })
  export class TextFieldShowcaseComponent implements OnInit {
  
    valueFromInput1 = '';
    valueFromInput2 = '';
  
    myForm1: FormGroup;
    myForm2: FormGroup;
  
    constructor(private formBuilder: FormBuilder) {
    }
  
    ngOnInit() {
  
      this.myForm1 = this.formBuilder.group({
        name1: ['', Validators.required]
      });
      this.myForm2 = this.formBuilder.group({
        name2: ['', [Validators.required, Validators.minLength(3)]]
      });
    }
  
    onKeyEnter1(event: any) {
      this.valueFromInput1 = event.target.value;
    }
  
    onKeyEnter2(event: any) {
      this.valueFromInput2 = event.target.value;
    }
  
  }`;

  optionsForHTML = { theme: 'default', language: 'html', readOnly: true, automaticLayout: true };
  optionsForTS = { theme: 'default', language: 'typescript', readOnly: true, automaticLayout: true };

  constructor() {
  }

  ngOnInit() {
  }

}

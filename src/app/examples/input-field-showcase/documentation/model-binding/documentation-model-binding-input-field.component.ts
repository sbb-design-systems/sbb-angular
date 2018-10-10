import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-model-binding',
  templateUrl: './documentation-model-binding-input-field.component.html',
  styleUrls: ['./documentation-model-binding-input-field.component.scss']
})
export class DocumentationModelBindingInputFieldComponent implements OnInit {

  modelBindingText = 'Model binding goes here ...';

  constructor() {
  }

  ngOnInit() {
  }

}

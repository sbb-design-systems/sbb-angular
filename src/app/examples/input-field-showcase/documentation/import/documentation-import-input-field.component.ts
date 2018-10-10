import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-import',
  templateUrl: './documentation-import-input-field.component.html',
  styleUrls: ['./documentation-import-input-field.component.scss']
})
export class DocumentationImportInputFieldComponent implements OnInit {

  importText = 'Import <b>TextInputModule</b> as follows :';

  options = { theme: 'default', language: 'typescript', readOnly: true, automaticLayout: true };
  codeImport = `import { TextInputModule } from 'sbb-angular';`;

  constructor() {
  }

  ngOnInit() {
  }

}

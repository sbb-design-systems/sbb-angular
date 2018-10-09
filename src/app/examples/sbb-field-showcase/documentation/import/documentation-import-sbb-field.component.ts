import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-field-showcase-documentation-import',
  templateUrl: './documentation-import-sbb-field.component.html',
  styleUrls: ['./documentation-import-sbb-field.component.scss']
})
export class DocumentationImportSbbFieldComponent implements OnInit {

  importText = 'Import <b>TextInputModule</b> as follows :';

  options = { theme: 'default', language: 'typescript', readOnly: true, automaticLayout: true };
  codeImport = `import { TextInputModule } from 'sbb-angular';`;

  constructor() {
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-input-field-showcase-documentation-dependencies',
  templateUrl: './documentation-dependencies-input-field.component.html',
  styleUrls: ['./documentation-dependencies-input-field.component.scss']
})
export class DocumentationDependenciesInputFieldComponent implements OnInit {

  dependenciesText = 'Dependencies goes here ...';

  constructor() {
  }

  ngOnInit() {
  }

}

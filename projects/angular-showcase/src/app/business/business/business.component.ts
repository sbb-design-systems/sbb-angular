import { HttpClient } from '@angular/common/http';
import { Component, Type } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { MarkdownProvider } from '../../shared/markdown-provider';

@Component({
  selector: 'sbb-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
  providers: [
    { provide: MarkdownProvider, useExisting: BusinessComponent },
    { provide: ExampleProvider, useExisting: BusinessComponent }
  ]
})
export class BusinessComponent implements MarkdownProvider, ExampleProvider {
  formComponents = {
    autocomplete: 'Autocomplete',
    checkbox: 'Checkbox',
    datepicker: 'Datepicker',
    field: 'Field',
    'radio-button': 'Radiobutton',
    select: 'Select',
    textarea: 'Textarea',
    'time-input': 'Time Input'
  };
  layoutComponents = {
    accordion: 'Accordion'
  };
  buttonAndIndicatorComponents = {
    button: 'Button'
  };
  popupsAndModals = {};
  private _examples = {};

  constructor(private _http: HttpClient) {}

  downloadMarkdown(path: string): Promise<string> {
    return this._http
      .get(`assets/docs/angular-public/${path}.html`, { responseType: 'text' })
      .toPromise();
  }

  resolveExample<TComponent = any>(component: string): Type<TComponent> {
    return this._examples[component];
  }
}

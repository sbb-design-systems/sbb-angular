import { HttpClient } from '@angular/common/http';
import { Component, Type } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { MarkdownProvider } from '../../shared/markdown-provider';
import { ClearInputShowcaseComponent } from '../examples/clear-input-showcase/clear-input-showcase.component';

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
    'clear-input': 'Clear Input',
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
  private _examples = {
    'clear-input': ClearInputShowcaseComponent
  };

  constructor(private _http: HttpClient) {}

  downloadMarkdown(path: string): Promise<string> {
    return this._http
      .get(`assets/docs/angular-business/${path}.html`, { responseType: 'text' })
      .toPromise();
  }

  resolveExample<TComponent = any>(component: string): Type<TComponent> {
    return this._examples[component];
  }
}

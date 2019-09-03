import { Component, Type } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { HtmlLoader } from '../../shared/html-loader.service';
import { ContextmenuShowcaseComponent } from '../examples/contextmenu-showcase/contextmenu-showcase.component';
import { ProcessflowShowcaseComponent } from '../examples/processflow-showcase/processflow-showcase.component';

@Component({
  selector: 'sbb-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
  providers: [{ provide: ExampleProvider, useExisting: BusinessComponent }, HtmlLoader]
})
export class BusinessComponent implements ExampleProvider {
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
  navigationComponents = {
    header: 'Header'
  };
  layoutComponents = {
    accordion: 'Accordion',
    processflow: 'Processflow'
  };
  buttonAndIndicatorComponents = {
    button: 'Button',
    contextmenu: 'Contextmenu'
  };
  popupsAndModals = {};
  private _examples = {
    processflow: ProcessflowShowcaseComponent
  };
    contextmenu: ContextmenuShowcaseComponent
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

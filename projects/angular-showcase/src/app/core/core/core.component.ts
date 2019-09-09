import { Component, Type } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { HtmlLoader } from '../../shared/html-loader.service';

@Component({
  selector: 'sbb-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  providers: [{ provide: ExampleProvider, useExisting: CoreComponent }, HtmlLoader]
})
export class CoreComponent implements ExampleProvider {
  modules = {
    breakpoints: 'Breakpoints',
    datetime: 'Datetime'
  };
  private _examples = {};

  resolveExample<TComponent = any>(component: string): Type<TComponent> {
    return this._examples[component];
  }
}

import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';

@Component({
  selector: 'sbb-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  providers: [{ provide: ExampleProvider, useExisting: CoreComponent }]
})
export class CoreComponent implements ExampleProvider {
  modules = {
    breakpoints: 'Breakpoints',
    datetime: 'Datetime'
  };
  private _examples: { [component: string]: { [name: string]: ComponentPortal<any> } } = {};

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}

import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';

@Component({
  selector: 'sbb-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css'],
  providers: [{ provide: ExampleProvider, useExisting: CoreComponent }]
})
export class CoreComponent implements ExampleProvider {
  modules = {
    breakpoints: 'Breakpoints',
    datetime: 'Datetime',
    oauth: 'OAuth',
    scrolling: 'Scrolling'
  };

  resolveExample<TComponent = any>(
    _component: string
  ): { [name: string]: ComponentPortal<TComponent> } | null {
    return null;
  }
}

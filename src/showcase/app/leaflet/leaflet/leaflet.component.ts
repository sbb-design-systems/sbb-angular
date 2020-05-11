import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { LeafletMapExampleComponent } from '../leaflet-examples/leaflet-map-examples/leaflet-map-example/leaflet-map-example.component';

@Component({
  selector: 'sbb-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  providers: [{ provide: ExampleProvider, useExisting: LeafletComponent }]
})
export class LeafletComponent implements ExampleProvider {
  maps = {
    'leaflet-map': 'Leaflet Map'
  };

  private _examples: { [component: string]: { [name: string]: ComponentPortal<any> } } = {
    'leaflet-map': { 'leaflet-map-example': new ComponentPortal(LeafletMapExampleComponent) }
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}

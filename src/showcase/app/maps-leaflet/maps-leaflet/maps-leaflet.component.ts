import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { LeafletMapExampleComponent } from '../maps-leaflet-examples/leaflet-map-examples/leaflet-map-example/leaflet-map-example.component';

@Component({
  selector: 'sbb-maps-leaflet',
  templateUrl: './maps-leaflet.component.html',
  styleUrls: ['./maps-leaflet.component.scss'],
  providers: [{ provide: ExampleProvider, useExisting: MapsLeafletComponent }],
})
export class MapsLeafletComponent implements ExampleProvider {
  maps = {
    'leaflet-map': 'Leaflet Map',
  };

  private _examples: { [component: string]: { [name: string]: ComponentPortal<any> } } = {
    'leaflet-map': { 'leaflet-map-example': new ComponentPortal(LeafletMapExampleComponent) },
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}

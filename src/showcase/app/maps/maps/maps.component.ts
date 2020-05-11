import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { EsriBasemapGalleryExampleComponent } from '../maps-examples/esri-basemap-gallery-examples/esri-basemap-gallery-example/esri-basemap-gallery-example.component';
import { EsriLayerListExampleComponent } from '../maps-examples/esri-layer-list-examples/esri-layer-list-example/esri-layer-list-example.component';
import { EsriLegendExampleComponent } from '../maps-examples/esri-legend-examples/esri-legend-example/esri-legend-example.component';
import { EsriWebMapExampleComponent } from '../maps-examples/esri-web-map-examples/esri-web-map-example/esri-web-map-example.component';
import { EsriWebSceneExampleComponent } from '../maps-examples/esri-web-scene-examples/esri-web-scene-example/esri-web-scene-example.component';

@Component({
  selector: 'sbb-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  providers: [{ provide: ExampleProvider, useExisting: MapsComponent }]
})
export class MapsComponent implements ExampleProvider {
  maps = {
    'esri-web-map': 'WebMap',
    'esri-web-scene': 'WebScene'
  };
  mapUtilities = {
    'esri-layer-list': 'Layerlist',
    'esri-basemap-gallery': 'Basemap Gallery',
    'esri-legend': 'Legend'
  };

  private _examples: { [component: string]: { [name: string]: ComponentPortal<any> } } = {
    'esri-web-map': { 'esri-web-map-example': new ComponentPortal(EsriWebMapExampleComponent) },
    'esri-web-scene': {
      'esri-web-scene-example': new ComponentPortal(EsriWebSceneExampleComponent)
    },
    'esri-basemap-gallery': {
      'esri-basemap-gallery-example': new ComponentPortal(EsriBasemapGalleryExampleComponent)
    },
    'esri-legend': {
      'esri-legend-example': new ComponentPortal(EsriLegendExampleComponent)
    },
    'esri-layer-list': {
      'esri-layer-list-example': new ComponentPortal(EsriLayerListExampleComponent)
    }
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}

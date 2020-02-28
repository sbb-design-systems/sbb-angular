import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';

import { ExampleProvider } from '../../shared/example-provider';
import { EsriBasemapGalleryShowcaseComponent } from '../maps-examples/esri-basemap-gallery-showcase/esri-basemap-gallery-showcase.component';
import { EsriLayerListShowcaseComponent } from '../maps-examples/esri-layer-list-showcase/esri-layer-list-showcase.component';
import { EsriLegendShowcaseComponent } from '../maps-examples/esri-legend-showcase/esri-legend-showcase.component';
import { EsriWebMapShowcaseComponent } from '../maps-examples/esri-web-map-showcase/esri-web-map-showcase.component';
import { EsriWebSceneShowcaseComponent } from '../maps-examples/esri-web-scene-showcase/esri-web-scene-showcase.component';

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
    'esri-web-map': { 'esri-web-map-showcase': new ComponentPortal(EsriWebMapShowcaseComponent) },
    'esri-web-scene': {
      'esri-web-scene-showcase': new ComponentPortal(EsriWebSceneShowcaseComponent)
    },
    'esri-basemap-gallery': {
      'esri-basemap-gallery-showcase': new ComponentPortal(EsriBasemapGalleryShowcaseComponent)
    },
    'esri-legend': {
      'esri-legend-showcase': new ComponentPortal(EsriLegendShowcaseComponent)
    },
    'esri-layer-list': {
      'esri-layer-list-showcase': new ComponentPortal(EsriLayerListShowcaseComponent)
    }
  };

  resolveExample<TComponent = any>(
    component: string
  ): { [name: string]: ComponentPortal<TComponent> } {
    return this._examples[component];
  }
}

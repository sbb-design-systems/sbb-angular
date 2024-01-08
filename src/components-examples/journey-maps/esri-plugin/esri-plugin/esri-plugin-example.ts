import { Component } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import {
  SbbEsriFeatureLayer,
  SbbEsriPluginModule,
  SbbJourneyMapsModule,
} from '@sbb-esta/journey-maps';
import { Map as MaplibreMap } from 'maplibre-gl';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Esri Plugin Example
 */
@Component({
  selector: 'sbb-esri-plugin-example',
  templateUrl: 'esri-plugin-example.html',
  styleUrl: 'esri-plugin-example.css',
  standalone: true,
  imports: [SbbJourneyMapsModule, SbbNotificationModule, SbbEsriPluginModule],
})
export class EsriPluginExample {
  apiKey = window.JM_API_KEY;

  public esriLayerDefinition: SbbEsriFeatureLayer[] = [
    {
      url: 'https://services7.arcgis.com/RZYPa9cXL4L1fYTj/ArcGIS/rest/services/J-M-C-ArcGIS-TEST/FeatureServer/1',
    },
    {
      url: 'https://services7.arcgis.com/RZYPa9cXL4L1fYTj/ArcGIS/rest/services/J-M-C-ArcGIS-TEST/FeatureServer/2',
    },
    {
      url: 'https://services7.arcgis.com/RZYPa9cXL4L1fYTj/ArcGIS/rest/services/J-M-C-ArcGIS-TEST/FeatureServer/0',
      style: {
        type: 'line',
        paint: {
          'line-color': '#FF0000',
        },
        minzoom: 0,
        maxzoom: 11,
      },
    },
  ];

  private _map: MaplibreMap;
  public get map(): MaplibreMap {
    return this._map;
  }
  public set map(v: MaplibreMap) {
    this._map = v;
  }
}

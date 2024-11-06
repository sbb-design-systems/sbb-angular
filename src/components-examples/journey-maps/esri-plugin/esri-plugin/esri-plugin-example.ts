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
  styleUrls: ['esri-plugin-example.css'],
  imports: [SbbJourneyMapsModule, SbbNotificationModule, SbbEsriPluginModule],
})
export class EsriPluginExample {
  apiKey = window.JM_API_KEY;

  map: MaplibreMap;

  esriLayerDefinition: SbbEsriFeatureLayer[] = [
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
      filter: "category = 'b'",
    },
    {
      url: 'https://services7.arcgis.com/RZYPa9cXL4L1fYTj/ArcGIS/rest/services/DEV_JMC_multipunkte/FeatureServer/0',
    },
  ];

  sourceAdded(message: string) {
    console.log(`Source added: ${message}`);
  }

  layerAdded(message: string) {
    console.log(`Layer added: ${message}`);
  }
}

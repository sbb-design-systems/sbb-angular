import { Component } from '@angular/core';

@Component({
  selector: 'sbb-maps',
  templateUrl: './maps.component.html',
})
export class MapsComponent {
  maps = {
    'esri-web-map': 'WebMap',
    'esri-web-scene': 'WebScene',
  };
  mapUtilities = {
    'esri-layer-list': 'Layerlist',
    'esri-basemap-gallery': 'Basemap Gallery',
    'esri-legend': 'Legend',
  };
}

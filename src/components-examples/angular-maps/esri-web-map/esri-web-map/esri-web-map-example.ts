import { Component } from '@angular/core';

/**
 * @title Esri Web Map With Event Handlers
 */
@Component({
  selector: 'sbb-esri-web-map-example',
  templateUrl: './esri-web-map-example.html',
  styleUrls: ['./esri-web-map-example.css'],
})
export class EsriWebMapExample {
  mapIsReady = false;
  activeExtent: { xmin: number; xmax: number; ymin: number; ymax: number };
  clickedPoint: { x: number; y: number };
}

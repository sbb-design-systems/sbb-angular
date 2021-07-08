import { Component } from '@angular/core';
@Component({
  selector: 'sbb-esri-web-map-example',
  templateUrl: './esri-web-map-example.component.html',
  styleUrls: ['./esri-web-map-example.component.css'],
})
export class EsriWebMapExampleComponent {
  mapIsReady = false;
  activeExtent: { xmin: number; xmax: number; ymin: number; ymax: number };
  clickedPoint: { x: number; y: number };
}

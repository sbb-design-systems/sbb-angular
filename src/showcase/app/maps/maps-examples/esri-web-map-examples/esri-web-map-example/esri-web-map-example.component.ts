import { Component } from '@angular/core';
@Component({
  selector: 'sbb-esri-web-map-example',
  templateUrl: './esri-web-map-example.component.html',
  styleUrls: ['./esri-web-map-example.component.css'],
})
export class EsriWebMapExampleComponent {
  public mapIsReady = false;
  public activeExtent: { xmin: number; xmax: number; ymin: number; ymax: number };
  public clickedPoint: { x: number; y: number };
}

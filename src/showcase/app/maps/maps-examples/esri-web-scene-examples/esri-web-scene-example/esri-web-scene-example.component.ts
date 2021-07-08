import { Component } from '@angular/core';

@Component({
  selector: 'sbb-esri-web-scene-example',
  templateUrl: './esri-web-scene-example.component.html',
  styleUrls: ['./esri-web-scene-example.component.css'],
})
export class EsriWebSceneExampleComponent {
  mapIsReady = false;
  centerPoint: { x: number; y: number; z: number };
  clickedPoint: { x: number; y: number; z: number };
}

import { Component } from '@angular/core';

@Component({
  selector: 'sbb-esri-web-scene-example',
  templateUrl: './esri-web-scene-example.component.html',
  styleUrls: ['./esri-web-scene-example.component.css'],
})
export class EsriWebSceneExampleComponent {
  public mapIsReady = false;
  public centerPoint: { x: number; y: number; z: number };
  public clickedPoint: { x: number; y: number; z: number };
}

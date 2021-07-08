import { Component } from '@angular/core';

/**
 * @title Esri Web Scene With Event Handlers & Custom Properties
 */
@Component({
  selector: 'sbb-esri-web-scene-example',
  templateUrl: './esri-web-scene-example.html',
  styleUrls: ['./esri-web-scene-example.css'],
})
export class EsriWebSceneExample {
  mapIsReady = false;
  centerPoint: { x: number; y: number; z: number };
  clickedPoint: { x: number; y: number; z: number };
}

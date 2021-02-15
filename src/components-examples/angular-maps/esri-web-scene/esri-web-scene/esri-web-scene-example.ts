// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

import { Component, OnInit } from '@angular/core';

/**
 * @title Esri Web Scene With Event Handlers & Custom Properties
 */
@Component({
  selector: 'sbb-esri-web-scene-example',
  templateUrl: './esri-web-scene-example.html',
  styleUrls: ['./esri-web-scene-example.css'],
})
export class EsriWebSceneExample implements OnInit {
  public centerPoint: { x: number; y: number; z: number };
  public clickedPoint: { x: number; y: number; z: number };
  public sceneView: __esri.SceneView;

  ngOnInit(): void {}

  mapExtentChanged(extent: __esri.Camera) {
    const { x, y, z } = extent.position;
    this.centerPoint = { x: x, y: y, z: z };
  }

  mapReady(sv: __esri.SceneView) {
    this.sceneView = sv;
  }

  mapClicked(clickResult: { clickedPoint: __esri.Point; clickedGraphics: __esri.Graphic[] }) {
    const { x, y, z } = clickResult.clickedPoint;
    this.clickedPoint = { x: x, y: y, z: z };
  }
}

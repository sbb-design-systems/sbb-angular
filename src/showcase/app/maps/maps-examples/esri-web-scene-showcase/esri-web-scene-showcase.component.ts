import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sbb-esri-web-scene-showcase',
  templateUrl: './esri-web-scene-showcase.component.html',
  styleUrls: ['./esri-web-scene-showcase.component.css']
})
export class EsriWebSceneShowcaseComponent implements OnInit {
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

  mapClicked(clickResult: { clickedPoint: __esri.Point; clickedGraphic: __esri.Graphic }) {
    const { x, y, z } = clickResult.clickedPoint;
    this.clickedPoint = { x: x, y: y, z: z };
  }
}

import { Component, OnInit } from '@angular/core';

/**
 * @title Esri Web Map With Event Handlers
 */
@Component({
  selector: 'sbb-esri-web-map-example',
  templateUrl: './esri-web-map-example.html',
  styleUrls: ['./esri-web-map-example.css'],
})
export class EsriWebMapExample implements OnInit {
  public activeExtent: { xmin: number; xmax: number; ymin: number; ymax: number };
  public clickedPoint: { x: number; y: number };
  public mapView: __esri.MapView;
  ngOnInit(): void {}

  mapExtentChanged(extent: __esri.Extent) {
    const { xmin, xmax, ymin, ymax } = extent;
    this.activeExtent = { xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax };
  }

  mapReady(mv: __esri.MapView) {
    this.mapView = mv;
  }

  mapClicked(clickResult: { clickedPoint: __esri.Point; clickedGraphics: __esri.Graphic[] }) {
    this.clickedPoint = { x: clickResult.clickedPoint.x, y: clickResult.clickedPoint.y };
  }
}

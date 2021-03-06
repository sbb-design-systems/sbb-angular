// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { SbbEsriTypesService } from '@sbb-esta/angular-maps/core';

@Component({
  selector: 'sbb-esri-layer-list',
  templateUrl: './esri-layer-list.component.html',
  styleUrls: ['./esri-layer-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriLayerList implements OnInit {
  /** References the map or scene to load the the layer list */
  @Input() mapView: __esri.MapView | __esri.SceneView;

  /** References the ESRI Layerlist object */
  public layerList: __esri.LayerList;

  constructor(private _esri: SbbEsriTypesService, private _hostReference: ElementRef) {}

  /** Loads & instantiates the basemap gallery. */
  ngOnInit() {
    this._esri.load().then(() => {
      this.layerList = new this._esri.LayerList({
        view: this.mapView,
        container: this._hostReference.nativeElement,
      });
    });
  }
}

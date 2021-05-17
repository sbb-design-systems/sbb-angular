// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="arcgis-js-api" />

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { SbbEsriTypesService } from '@sbb-esta/angular-maps/core';

@Component({
  selector: 'sbb-esri-basemap-gallery',
  templateUrl: './esri-basemap-gallery.component.html',
  styleUrls: ['./esri-basemap-gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriBasemapGallery implements OnInit {
  /** References the map or scene to load the basemap gallery. */
  @Input() mapView: __esri.MapView | __esri.SceneView;

  /** References the ESRI BasemapGallery object */
  public basemapGallery: __esri.BasemapGallery;

  constructor(private _esri: SbbEsriTypesService, private _hostReference: ElementRef) {}

  /** Loads & instantiates the basemap gallery. */
  ngOnInit() {
    this._esri.load().then(() => {
      this.basemapGallery = new this._esri.BasemapGallery({
        view: this.mapView,
        container: this._hostReference.nativeElement,
      });
    });
  }
}

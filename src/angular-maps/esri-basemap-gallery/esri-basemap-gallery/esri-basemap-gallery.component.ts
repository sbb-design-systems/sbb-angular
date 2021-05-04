import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';

@Component({
  selector: 'sbb-esri-basemap-gallery',
  templateUrl: './esri-basemap-gallery.component.html',
  styleUrls: ['./esri-basemap-gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriBasemapGallery implements OnInit {
  /** References the map or scene to load the basemap gallery. */
  @Input() mapView: MapView | SceneView;

  /** References the ESRI BasemapGallery object */
  public basemapGallery: BasemapGallery;

  constructor(private _hostReference: ElementRef) {}

  /** Loads & instantiates the basemap gallery. */
  ngOnInit() {
    this.basemapGallery = new BasemapGallery({
      view: this.mapView,
      container: this._hostReference.nativeElement,
    });
  }
}

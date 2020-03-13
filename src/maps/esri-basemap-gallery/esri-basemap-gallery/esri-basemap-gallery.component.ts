import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { EsriTypesService } from '@sbb-esta/angular-maps/core';

@Component({
  selector: 'sbb-esri-basemap-gallery',
  templateUrl: './esri-basemap-gallery.component.html',
  styleUrls: ['./esri-basemap-gallery.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsriBasemapGalleryComponent implements OnInit {
  /** References the map or scene to load the basemap gallery. */
  @Input() mapView: __esri.MapView | __esri.SceneView;

  /** References the ESRI BasemapGallery object */
  public basemapGallery: __esri.BasemapGallery;

  constructor(private _esri: EsriTypesService, private _hostReference: ElementRef) {}

  /** Loads & instantiates the basemap gallery. */
  async ngOnInit() {
    await this._esri.load();

    this.basemapGallery = new this._esri.BasemapGallery({
      view: this.mapView,
      container: this._hostReference.nativeElement
    });
  }
}

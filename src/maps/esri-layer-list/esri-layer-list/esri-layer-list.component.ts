import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { EsriTypesService } from '@sbb-esta/angular-maps/core';

@Component({
  selector: 'sbb-esri-layer-list',
  templateUrl: './esri-layer-list.component.html',
  styleUrls: ['./esri-layer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsriLayerListComponent implements OnInit {
  /** References the map or scene to load the the layer list */
  @Input() mapView: __esri.MapView | __esri.SceneView;

  /** References the ESRI Layerlist object */
  public layerList: __esri.LayerList;

  constructor(private _esri: EsriTypesService, private _hostReference: ElementRef) {}

  /** Loads & instantiates the basemap gallery. */
  async ngOnInit() {
    await this._esri.load();

    this.layerList = new this._esri.LayerList({
      view: this.mapView,
      container: this._hostReference.nativeElement
    });
  }
}

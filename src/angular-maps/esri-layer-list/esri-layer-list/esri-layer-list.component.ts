import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import LayerList from '@arcgis/core/widgets/LayerList';

@Component({
  selector: 'sbb-esri-layer-list',
  templateUrl: './esri-layer-list.component.html',
  styleUrls: ['./esri-layer-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriLayerList implements OnInit {
  /** References the map or scene to load the the layer list */
  @Input() mapView: MapView | SceneView;

  /** References the ESRI Layerlist object */
  public layerList: LayerList;

  constructor(private _hostReference: ElementRef) {}

  /** Loads & instantiates the basemap gallery. */
  ngOnInit() {
    this.layerList = new LayerList({
      view: this.mapView,
      container: this._hostReference.nativeElement,
    });
  }
}

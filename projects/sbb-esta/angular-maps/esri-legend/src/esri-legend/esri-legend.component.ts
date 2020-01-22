import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';

import { EsriTypesService } from '../esri-types/esri-types.service';

@Component({
  selector: 'sbb-esri-legend',
  templateUrl: './esri-legend.component.html',
  styleUrls: ['./esri-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsriLegendComponent implements OnInit {
  /** References the map or scene to load the the layer list */
  @Input() mapView: __esri.MapView | __esri.SceneView;

  /** Styles the legend using styles from https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Legend.html#style */
  @Input() sbblegendStyle: { type: 'classic' | 'card'; layout: 'auto' | 'side-by-side' | 'stack' };

  /** References the ESRI Layerlist object */
  public legend: __esri.Legend;

  constructor(private _esri: EsriTypesService, private _hostReference: ElementRef) {}

  /** Loads & instantiates the legend. */
  async ngOnInit() {
    await this._esri.load();

    this.legend = new this._esri.Legend({
      view: this.mapView,
      style: {
        type: this.sbblegendStyle.type,
        layout: this.sbblegendStyle.layout
      } as __esri.LegendStyle,
      container: this._hostReference.nativeElement
    });
  }
}

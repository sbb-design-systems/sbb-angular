import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';

import { EsriTypesService } from '../esri-types/esri-types.service';

import { SBBEsriMapLegendStyle } from './model/sbb-esri-map-legend-style.model';

@Component({
  selector: 'sbb-esri-legend',
  templateUrl: './esri-legend.component.html',
  styleUrls: ['./esri-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsriLegendComponent implements OnInit {
  /** References the map or scene to load the the layer list */
  @Input() mapView: __esri.MapView | __esri.SceneView;

  /** Style the legend. */
  @Input() sbblegendStyle: SBBEsriMapLegendStyle;

  /** References the ESRI Layerlist object */
  public legend: __esri.Legend;

  constructor(private _esri: EsriTypesService, private _hostReference: ElementRef) {}

  /** Loads & instantiates the legend. */
  async ngOnInit() {
    await this._esri.load();

    this.legend = new this._esri.Legend({
      view: this.mapView,
      style: this.sbblegendStyle.style,
      container: this._hostReference.nativeElement
    });
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { EsriTypesService } from '@sbb-esta/angular-maps/core';

@Component({
  selector: 'sbb-esri-legend',
  templateUrl: './esri-legend.component.html',
  styleUrls: ['./esri-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsriLegendComponent implements OnInit {
  /** References the map or scene to load the legend for.*/
  @Input() mapView: __esri.MapView | __esri.SceneView;

  /** Styles the legend using styles from https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Legend.html#style */
  @Input() sbblegendStyle: {
    type: 'classic' | 'card';
    layout: 'auto' | 'side-by-side' | 'stack';
  } = { type: 'classic', layout: 'auto' };

  /** References the ESRI legend object */
  public legend: __esri.Legend;

  constructor(private _esri: EsriTypesService, private _hostReference: ElementRef) {}

  /** Loads & instantiates the legend. */
  async ngOnInit() {
    await this._esri.load();

    this.legend = new this._esri.Legend({
      view: this.mapView,
      style: this.sbblegendStyle,
      container: this._hostReference.nativeElement
    });
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import Legend from '@arcgis/core/widgets/Legend';

@Component({
  selector: 'sbb-esri-legend',
  templateUrl: './esri-legend.component.html',
  styleUrls: ['./esri-legend.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbEsriLegend implements OnInit {
  /** References the map or scene to load the legend for.*/
  @Input() mapView: MapView | SceneView;

  /** Styles the legend using styles from https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Legend.html#style */
  @Input() sbblegendStyle: {
    type: 'classic' | 'card';
    layout: 'auto' | 'side-by-side' | 'stack';
  } = { type: 'classic', layout: 'auto' };

  /** References the ESRI legend object */
  public legend: Legend;

  constructor(private _hostReference: ElementRef) {}

  /** Loads & instantiates the legend. */
  ngOnInit() {
    this.legend = new Legend({
      view: this.mapView,
      style: this.sbblegendStyle,
      container: this._hostReference.nativeElement,
    });
  }
}

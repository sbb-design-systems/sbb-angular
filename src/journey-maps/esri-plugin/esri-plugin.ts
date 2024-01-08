import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';
import { Subject } from 'rxjs';

import {
  SbbEsriFeatureLayer,
} from './esri-plugin.interface';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'sbb-esri-plugin',
  templateUrl: './esri-plugin.html',
})
export class EsriPluginComponent implements OnChanges, OnDestroy {
  /**
   * The map (maplibre-gl) instance to be used.
   */
  @Input()
  public map: MaplibreMap;

  /**
   * The definition of the feature-layers.
   */
  @Input()
  public featureLayers: SbbEsriFeatureLayer[] = [];

  /**
   * Event that occurs, when the feature layer geojson map source was created and added to the map. Returns the map source id.
   */
  @Output()
  public mapSourceAdded: EventEmitter<string> = new EventEmitter();
  /**
   * Event that occurs, when the feature layer map layer was created and added to the map (inc. layer data). Returns the map layer id.
   */
  @Output()
  public mapLayerAdded: EventEmitter<string> = new EventEmitter();

  private _destroyed: Subject<void> = new Subject();

  constructor(private _configService: ConfigService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue && !changes.map?.previousValue) {
      this._initialize();
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }

  private _initialize(): void {
    if (!this.featureLayers) {
      throw new Error('There must be at least one feature-layer');
    }
    this._configService.loadConfigs(
      this.map,
      this.featureLayers,
      this._destroyed,
      this.mapSourceAdded,
      this.mapLayerAdded,
    );
  }
}

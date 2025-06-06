import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';

import { MaplibreMap, SbbEsriFeatureLayer } from './esri-plugin.interface';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'sbb-esri-plugin',
  templateUrl: './esri-plugin.html',
  standalone: false,
})
export class EsriPluginComponent implements OnChanges, OnDestroy {
  /**
   * The map (maplibre-gl) instance to be used.
   */
  @Input()
  map: MaplibreMap;

  /**
   * The definition of the feature-layers.
   */
  @Input()
  featureLayers: SbbEsriFeatureLayer[] = [];

  /**
   * Event that occurs, when the feature layer geojson map source was created and added to the map. Returns the map source id.
   */
  @Output()
  mapSourceAdded: EventEmitter<string> = new EventEmitter();
  /**
   * Event that occurs, when the feature layer map layer was created and added to the map (inc. layer data). Returns the map layer id.
   */
  @Output()
  mapLayerAdded: EventEmitter<string> = new EventEmitter();

  private _destroyed: Subject<void> = new Subject();

  private _latestStyleUrl: string;

  constructor(private _configService: ConfigService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['map']?.currentValue && !changes['map']?.previousValue) {
      if (!this.featureLayers.length) {
        console.error('There must be at least one feature-layer');
        return;
      }
      this._initialize();
      this.map.once('idle', () => {
        this._latestStyleUrl = this.map.getStyle().sprite as string;
        this.map.on('styledata', () => this.map.once('idle', () => this._checkStyleChange()));
      });
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }

  private _initialize(): void {
    this._configService.loadConfigs(
      this.map,
      this.featureLayers,
      this._destroyed,
      this.mapSourceAdded,
      this.mapLayerAdded,
    );
  }

  private _checkStyleChange(): void {
    const newUrl = this.map.getStyle().sprite as string;
    if (newUrl === this._latestStyleUrl) {
      return;
    }
    this._latestStyleUrl = newUrl;
    this._initialize();
  }
}

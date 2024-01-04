import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { FeatureLayer } from './esri-plugin.interface';

@Component({
  selector: 'sbb-esri-plugin',
  templateUrl: './esri-plugin.html',
})
export class EsriPluginComponent implements OnChanges {
  /**
   * The map (maplibre-gl) instance to be used.
   */
  @Input()
  public map: MaplibreMap;

  /**
   * The map (maplibre-gl) instance to be used.
   */
  @Input()
  public featureLayers: FeatureLayer[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue && !changes.map?.previousValue) {
      this.initialize();
    }
  }

  private initialize(): void {
    throw new Error('Method not implemented.');
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';

import { SbbEsriFeatureLayer } from './esri-plugin.interface';

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
  public featureLayers: SbbEsriFeatureLayer[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue && !changes.map?.previousValue) {
      this.initialize();
    }
  }

  private initialize(): void {
    if (!this.featureLayers) {
      throw new Error('There must be at least one feature-layer');
    }
  }
}

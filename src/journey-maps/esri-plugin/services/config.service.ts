import { EventEmitter, Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';
import { catchError, forkJoin, map as rxjsMap, Subject, takeUntil } from 'rxjs';

import {
  SbbEsriError,
  SbbEsriFeatureLayer,
  SbbEsriFeatureLayerAndConfig,
} from '../esri-plugin.interface';

import { EsriFeatureService } from './esri-feature.service';
import { MaplibreLayerService } from './maplibre-layer.service';
import { MaplibreSourceService } from './maplibre-source.service';
import { MaplibreUtilService } from './maplibre-util.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    private _esriFeatureService: EsriFeatureService,
    private _maplibreUtilService: MaplibreUtilService,
    private _maplibreSourceService: MaplibreSourceService,
    private _maplibreLayerService: MaplibreLayerService,
  ) {}

  public loadConfigs(
    map: MaplibreMap,
    featureLayers: SbbEsriFeatureLayer[],
    destroyed: Subject<void>,
    mapSourceAdded: EventEmitter<string>,
    mapLayerAdded: EventEmitter<string>,
  ): void {
    forkJoin(featureLayers.map((layer) => this._esriFeatureService.getLayerConfig(layer)))
      .pipe(
        takeUntil(destroyed),
        catchError((error) => {
          console.error(error);
          return [];
        }),
        rxjsMap((configs) => {
          return featureLayers.map<SbbEsriFeatureLayerAndConfig>((layer, index) => ({
            layerDefinition: layer,
            config: configs[index],
          }));
        }),
      )
      .subscribe((configsAndLayers) => {
        console.log(configsAndLayers);
        configsAndLayers.forEach((configAndLayer) =>
          this._loadFeaturesForConfig(
            map,
            configAndLayer,
            destroyed,
            mapSourceAdded,
            mapLayerAdded,
          ),
        );
      });
  }

  private _loadFeaturesForConfig(
    map: MaplibreMap,
    configAndLayer: SbbEsriFeatureLayerAndConfig,
    destroyed: Subject<void>,
    mapSourceAdded: EventEmitter<string>,
    mapLayerAdded: EventEmitter<string>,
  ): void {
    if (configAndLayer.config instanceof SbbEsriError) {
      console.error(
        `Failed to call service ${configAndLayer.layerDefinition.url}`,
        configAndLayer.config as SbbEsriError,
      );
      return;
    }
    this._esriFeatureService
      .getFeatures(configAndLayer.layerDefinition)
      .pipe(takeUntil(destroyed))
      .subscribe((features) => {
        // this.ref.detectChanges();
        try {
          this._addFeaturesToMap(map, features, configAndLayer, mapSourceAdded, mapLayerAdded);
        } catch (error) {
          console.error(
            `Failed to initialize layer ${this._maplibreUtilService.getLayerId(
              configAndLayer.layerDefinition,
            )} | ${error}`,
          );
        }
      });
  }

  private _addFeaturesToMap(
    map: MaplibreMap,
    features: GeoJSON.Feature<GeoJSON.Geometry>[],
    configAndLayer: SbbEsriFeatureLayerAndConfig,
    mapSourceAdded: EventEmitter<string>,
    mapLayerAdded: EventEmitter<string>,
  ): void {
    const layerId = this._maplibreUtilService.getLayerId(configAndLayer.layerDefinition);
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    const sourceId = this._maplibreUtilService.getSourceId(configAndLayer.layerDefinition);
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    this._maplibreSourceService.addFeaturesAsMapSource(
      map,
      features,
      configAndLayer.layerDefinition,
      mapSourceAdded,
    );
    this._maplibreLayerService.addFeaturesAsMapLayer(map, configAndLayer, mapLayerAdded);
  }
}

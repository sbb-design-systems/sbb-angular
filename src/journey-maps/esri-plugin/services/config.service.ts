import { EventEmitter, Injectable } from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';
import { forkJoin, map as rxjsMap, mergeMap, Observable, Subject, takeUntil } from 'rxjs';

import { SbbEsriFeatureLayer, SbbEsriViewInformations } from '../esri-plugin.interface';

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
        rxjsMap((configs) => {
          return featureLayers
            .filter((_, index) => !!configs[index])
            .map<SbbEsriViewInformations>((layer, index) => ({
              layerDefinition: layer,
              config: configs[index]!,
              features: [],
            }));
        }),
        rxjsMap((viewInformations) => {
          return forkJoin(
            viewInformations.map((configAndLayer) =>
              this._loadFeaturesForConfig(configAndLayer, destroyed),
            ),
          );
        }),
        mergeMap((viewInformations) => {
          return viewInformations;
        }),
      )
      .subscribe((viewInformations) => {
        viewInformations.forEach((viewInformation) => {
          try {
            this._addFeaturesToMap(map, viewInformation, mapSourceAdded, mapLayerAdded);
          } catch (error) {
            console.error(
              `Failed to initialize layer ${this._maplibreUtilService.getLayerId(
                viewInformation.layerDefinition,
              )} and its source | ${error}`,
            );
          }
        });
      });
  }

  private _loadFeaturesForConfig(
    layer: SbbEsriViewInformations,
    destroyed: Subject<void>,
  ): Observable<SbbEsriViewInformations> {
    return this._esriFeatureService.getFeatures(layer.layerDefinition).pipe(
      takeUntil(destroyed),
      rxjsMap((features) => ({
        ...layer,
        features,
      })),
    );
  }

  private _addFeaturesToMap(
    map: MaplibreMap,
    viewInformations: SbbEsriViewInformations,
    mapSourceAdded: EventEmitter<string>,
    mapLayerAdded: EventEmitter<string>,
  ): void {
    const layerId = this._maplibreUtilService.getLayerId(viewInformations.layerDefinition);
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    const sourceId = this._maplibreUtilService.getSourceId(viewInformations.layerDefinition);
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    this._maplibreSourceService.addFeaturesAsMapSource(
      map,
      viewInformations.features,
      viewInformations.layerDefinition,
      mapSourceAdded,
    );
    this._maplibreLayerService.addFeaturesAsMapLayer(map, viewInformations, mapLayerAdded);
  }
}

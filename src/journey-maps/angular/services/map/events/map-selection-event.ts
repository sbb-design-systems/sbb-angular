import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';
import { Subject, Subscription } from 'rxjs';
import { sampleTime } from 'rxjs/operators';

import {
  SbbFeatureData,
  SbbFeatureDataType,
  SbbFeaturesSelectEventData,
  SbbSelectionMode,
} from '../../../journey-maps.interfaces';

import { SbbMapEventUtils } from './map-event-utils';
import { SbbRouteUtils } from './route-utils';

const SBB_MAP_MOVE_SAMPLE_TIME_MS = 100;
export const SBB_SELECTED_PROPERTY_NAME = 'isSelected';

/**
 journey-maps-client component scope service.
 Use one service instance per map instance.
 */
@Injectable()
export class SbbMapSelectionEvent {
  private _lastRouteEventData: Map<Feature, boolean>;
  private _subscription: Subscription;

  private _mapInstance: MaplibreMap;
  private _layersTypes: Map<string, SbbFeatureDataType>;
  private _selectionModes: Map<SbbFeatureDataType, SbbSelectionMode>;
  private _touchedZoneIds: Set<number> = new Set();

  constructor(
    private _routeUtilsService: SbbRouteUtils,
    private _mapEventUtils: SbbMapEventUtils
  ) {}

  initialize(
    mapInstance: MaplibreMap,
    layersTypes: Map<string, SbbFeatureDataType>,
    selectionModes: Map<SbbFeatureDataType, SbbSelectionMode>
  ) {
    this._mapInstance = mapInstance;
    this._layersTypes = layersTypes;
    this._selectionModes = selectionModes;
    this._attachMapMoveEvent();
  }

  complete() {
    this._subscription?.unsubscribe();
  }

  toggleSelection(features: SbbFeatureData[]): void {
    const lastRouteEventDataCandidate = new Map<SbbFeatureData, boolean>();
    for (const feature of features) {
      const selected = !feature.state.selected;
      this._setFeatureSelection(feature, selected);

      if (feature.featureDataType === 'ZONE') {
        this._touchedZoneIds.add(Number(feature.id));
      } else if (feature.featureDataType === 'ROUTE') {
        lastRouteEventDataCandidate.set(feature, feature.state.selected);
      }
    }

    if (lastRouteEventDataCandidate.size) {
      this._lastRouteEventData = lastRouteEventDataCandidate;
    }
  }

  initSelectedState(
    mapInstance: MaplibreMap,
    features: Feature[],
    featureDataType: SbbFeatureDataType
  ): void {
    const selectedFeatures = features.filter((f) => f.properties![SBB_SELECTED_PROPERTY_NAME]);
    if (featureDataType === 'ROUTE') {
      selectedFeatures.forEach((feature) => {
        this._routeUtilsService.setRelatedRouteFeaturesSelection(mapInstance, feature, true);
      });
      this._lastRouteEventData = new Map(selectedFeatures.map((f) => [f, true]));
    }
    if (featureDataType === 'ZONE') {
      this._touchedZoneIds = new Set<number>();
      const featureDatas = this._mapEventUtils.queryFeatureSourceByFilter(mapInstance, 'ZONE', [
        '==',
        SBB_SELECTED_PROPERTY_NAME,
        true,
      ]);
      featureDatas.forEach((featureData) =>
        this._mapEventUtils.setFeatureState(featureData, mapInstance, { selected: true })
      );
    }
  }

  findSelectedFeatures(): SbbFeaturesSelectEventData {
    return {
      features: this._mapEventUtils.queryFeaturesByProperty(
        this._mapInstance,
        this._layersTypes,
        (feature) => feature.state.selected
      ),
    };
  }

  private _setFeatureSelection(data: SbbFeatureData, selected: boolean) {
    if (this._selectionModes.get(data.featureDataType) === 'single') {
      const sourceInfo = { source: data.source, sourceLayer: data.sourceLayer };
      this._mapInstance.removeFeatureState(sourceInfo);
    }

    this._mapEventUtils.setFeatureState(data, this._mapInstance, { selected });

    this._routeUtilsService.setRelatedRouteFeaturesSelection(this._mapInstance, data, selected);
  }

  private _attachMapMoveEvent() {
    this.complete();
    const mapMove = new Subject();
    this._subscription = mapMove.pipe(sampleTime(SBB_MAP_MOVE_SAMPLE_TIME_MS)).subscribe(() => {
      const map = this._mapInstance;
      this._lastRouteEventData?.forEach((isSelected, feature) => {
        this._routeUtilsService.setRelatedRouteFeaturesSelection(map, feature, isSelected);
      });
      const featureDatas = this._mapEventUtils.queryFeatureSourceByFilter(map, 'ZONE', [
        'all',
        ['==', SBB_SELECTED_PROPERTY_NAME, true],
        ['!in', '$id', ...this._touchedZoneIds],
      ]);
      featureDatas.forEach((featureData) =>
        this._mapEventUtils.setFeatureState(featureData, map, { selected: true })
      );
    });

    this._mapInstance.on('move', () => mapMove.next(undefined));
  }
}

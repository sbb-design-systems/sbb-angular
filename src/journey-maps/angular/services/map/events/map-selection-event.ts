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
import { SBB_POI_ID_PROPERTY } from '../../constants';
import { FeatureDataStateService } from '../feature-data-state.service';

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
    private _mapEventUtils: SbbMapEventUtils,
    private _featureDataStateService: FeatureDataStateService,
  ) {}

  initialize(
    mapInstance: MaplibreMap,
    layersTypes: Map<string, SbbFeatureDataType>,
    selectionModes: Map<SbbFeatureDataType, SbbSelectionMode>,
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

    if (features[0].featureDataType !== 'ROUTE') {
      const selectedRoutes: SbbFeatureData[] = this._featureDataStateService.getSelectedRoutes();
      selectedRoutes.forEach((route) => {
        lastRouteEventDataCandidate.set(route, false);
        this._routeUtilsService.setRelatedRouteFeaturesSelection(this._mapInstance, route, false);
      });
    }

    for (const feature of features) {
      const selected = !feature.state.selected;
      this._setFeatureSelection(feature, selected);
      if (feature.featureDataType === 'ZONE') {
        this._touchedZoneIds.add(Number(feature.id));
      } else if (feature.featureDataType === 'ROUTE') {
        this._selectRoute(selected, feature);
        lastRouteEventDataCandidate.set(feature, feature.state.selected);
      } else if (feature.featureDataType === 'POI') {
        this._selectPoi(selected, feature);
      }
    }

    if (lastRouteEventDataCandidate.size) {
      this._lastRouteEventData = lastRouteEventDataCandidate;
    }
  }

  private _selectPoi(selected: boolean, feature: SbbFeatureData) {
    if (selected) {
      this._featureDataStateService.selectPoi({
        id: feature.properties[SBB_POI_ID_PROPERTY],
      });
    } else {
      this._featureDataStateService.deselectPoi(feature);
    }
  }

  private _selectRoute(selected: boolean, route: SbbFeatureData) {
    if (selected) {
      this._featureDataStateService.selectRoute(route);
    } else {
      this._featureDataStateService.deselectRoute(route);
    }
  }

  initSelectedState(
    mapInstance: MaplibreMap,
    features: Feature[],
    featureDataType: SbbFeatureDataType,
  ): void {
    if (featureDataType === 'ROUTE') {
      const selectedFeatures = features.filter((f) => f.properties![SBB_SELECTED_PROPERTY_NAME]);
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
        this._mapEventUtils.setFeatureState(featureData, mapInstance, { selected: true }),
      );
    }
  }

  findSelectedFeatures(): SbbFeaturesSelectEventData {
    return {
      features: this._mapEventUtils.queryFeaturesByProperty(
        this._mapInstance,
        this._layersTypes,
        (feature) => feature.state.selected,
      ),
    };
  }

  // this method sets a SbbFeatureData as selected/unselected
  private _setFeatureSelection(data: SbbFeatureData, selected: boolean) {
    if (this._selectionModes.get(data.featureDataType) === 'single') {
      // if this SbbFeatureDataType has selectionMode 'single',
      // remove the 'featureState' for all MapGeoJSONFeature features containing this 'source' and 'sourceLayer'
      const sourceInfo = { source: data.source, sourceLayer: data.sourceLayer };
      this._mapInstance.removeFeatureState(sourceInfo);
    }

    // also, update the state of this MapGeoJSONFeature inside the map instance
    this._mapEventUtils.setFeatureState(data, this._mapInstance, { selected });

    // also, do the same state update for any 'related' route features (related because part of the same journey ??)
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
        this._mapEventUtils.setFeatureState(featureData, map, { selected: true }),
      );
    });

    this._mapInstance.on('move', () => mapMove.next(undefined));
  }
}

import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import { Map as MaplibreMap } from 'maplibre-gl';
import { Subject, Subscription } from 'rxjs';
import { sampleTime } from 'rxjs/operators';

import {
  FeatureData,
  FeatureDataType,
  FeaturesClickEventData,
  FeaturesSelectEventData,
  SelectionMode,
} from '../../../journey-maps-client.interfaces';

import { MapEventUtilsService } from './map-event-utils.service';
import { RouteUtilsService } from './route-utils.service';

const MAP_MOVE_SAMPLE_TIME_MS = 100;
export const SELECTED_PROPERTY_NAME = 'isSelected';

/**
 journey-maps-client component scope service.
 Use one service instance per map instance.
 */
@Injectable()
export class MapSelectionEventService {
  private _lastRouteEventData: Map<Feature, boolean>;
  private _subscription: Subscription;

  private _mapInstance: MaplibreMap;
  private _layersTypes: Map<string, FeatureDataType>;
  private _selectionModes: Map<FeatureDataType, SelectionMode>;
  private _touchedZoneIds: Set<number> = new Set();

  constructor(
    private _routeUtilsService: RouteUtilsService,
    private _mapEventUtils: MapEventUtilsService
  ) {}

  initialize(
    mapInstance: MaplibreMap,
    layersTypes: Map<string, FeatureDataType>,
    selectionModes: Map<FeatureDataType, SelectionMode>
  ) {
    this._mapInstance = mapInstance;
    this._layersTypes = layersTypes;
    this._selectionModes = selectionModes;
    this._attachMapMoveEvent();
  }

  complete() {
    this._subscription?.unsubscribe();
  }

  toggleSelection(eventData: FeaturesClickEventData): void {
    const lastRouteEventDataCandidate = new Map<FeatureData, boolean>();
    for (const feature of eventData.features) {
      const selected = !feature.state.selected;
      this._setFeatureSelection(feature, selected);

      if (feature.featureDataType === FeatureDataType.ZONE) {
        this._touchedZoneIds.add(Number(feature.id));
      } else if (feature.featureDataType === FeatureDataType.ROUTE) {
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
    featureDataType: FeatureDataType
  ): void {
    const selectedFeatures = features.filter((f) => f.properties![SELECTED_PROPERTY_NAME]);
    if (featureDataType === FeatureDataType.ROUTE) {
      selectedFeatures.forEach((feature) => {
        this._routeUtilsService.setRelatedRouteFeaturesSelection(mapInstance, feature, true);
      });
      this._lastRouteEventData = new Map(selectedFeatures.map((f) => [f, true]));
    }
    if (featureDataType === FeatureDataType.ZONE) {
      this._touchedZoneIds = new Set<number>();
      const featureDatas = this._mapEventUtils.queryFeatureSourceByFilter(
        mapInstance,
        FeatureDataType.ZONE,
        ['==', SELECTED_PROPERTY_NAME, true]
      );
      featureDatas.forEach((featureData) =>
        this._mapEventUtils.setFeatureState(featureData, mapInstance, { selected: true })
      );
    }
  }

  findSelectedFeatures(): FeaturesSelectEventData {
    return {
      features: this._mapEventUtils.queryFeaturesByProperty(
        this._mapInstance,
        this._layersTypes,
        (feature) => feature.state.selected
      ),
    };
  }

  private _setFeatureSelection(data: FeatureData, selected: boolean) {
    if (this._selectionModes.get(data.featureDataType) === SelectionMode.Single) {
      // if multiple features of same type, only the last in the list will be selected:
      this.findSelectedFeatures()
        .features.filter((f) => f.featureDataType === data.featureDataType)
        .forEach((f) =>
          this._mapEventUtils.setFeatureState(f, this._mapInstance, { selected: false })
        );
    }

    this._mapEventUtils.setFeatureState(data, this._mapInstance, { selected });

    this._routeUtilsService.setRelatedRouteFeaturesSelection(this._mapInstance, data, selected);
  }

  private _attachMapMoveEvent() {
    this.complete();
    const mapMove = new Subject();
    this._subscription = mapMove.pipe(sampleTime(MAP_MOVE_SAMPLE_TIME_MS)).subscribe(() => {
      const map = this._mapInstance;
      this._lastRouteEventData?.forEach((isSelected, feature) => {
        this._routeUtilsService.setRelatedRouteFeaturesSelection(map, feature, isSelected);
      });
      const featureDatas = this._mapEventUtils.queryFeatureSourceByFilter(
        map,
        FeatureDataType.ZONE,
        ['all', ['==', SELECTED_PROPERTY_NAME, true], ['!in', '$id', ...this._touchedZoneIds]]
      );
      featureDatas.forEach((featureData) =>
        this._mapEventUtils.setFeatureState(featureData, map, { selected: true })
      );
    });

    this._mapInstance.on('move', () => mapMove.next(undefined));
  }
}

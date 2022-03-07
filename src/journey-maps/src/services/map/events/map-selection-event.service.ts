import {
  FeatureData,
  FeatureDataType,
  FeaturesClickEventData,
  FeaturesSelectEventData,
  SelectionMode,
} from '../../../journey-maps-client.interfaces';
import {RouteUtilsService} from './route-utils.service';
import {MapEventUtilsService} from './map-event-utils.service';
import {Subject, Subscription} from 'rxjs';
import {sampleTime} from 'rxjs/operators';
import {Map as MaplibreMap} from 'maplibre-gl';
import {Feature} from 'geojson';
import {Injectable} from '@angular/core';

const MAP_MOVE_SAMPLE_TIME_MS = 100;
export const SELECTED_PROPERTY_NAME = 'isSelected';

/**
 journey-maps-client component scope service.
 Use one service instance per map instance.
 */
@Injectable()
export class MapSelectionEventService {
  private lastRouteEventData: Map<Feature, boolean>;
  private subscription: Subscription;

  private mapInstance: MaplibreMap;
  private layersTypes: Map<string, FeatureDataType>;
  private selectionModes: Map<FeatureDataType, SelectionMode>;
  private touchedZoneIds: Set<number> = new Set();

  constructor(
    private routeUtilsService: RouteUtilsService,
    private mapEventUtils: MapEventUtilsService) {
  }

  initialize(
    mapInstance: MaplibreMap,
    layersTypes: Map<string, FeatureDataType>,
    selectionModes: Map<FeatureDataType, SelectionMode>) {
    this.mapInstance = mapInstance;
    this.layersTypes = layersTypes;
    this.selectionModes = selectionModes;
    this.attachMapMoveEvent();
  }

  complete() {
    this.subscription?.unsubscribe();
  }

  toggleSelection(eventData: FeaturesClickEventData): void {
    const lastRouteEventDataCandidate = new Map<FeatureData, boolean>();
    for (let feature of eventData.features) {
      const selected = !feature.state.selected;
      this.setFeatureSelection(feature, selected);

      if (feature.featureDataType === FeatureDataType.ZONE) {
        this.touchedZoneIds.add(Number(feature.id));
      } else if (feature.featureDataType === FeatureDataType.ROUTE) {
        lastRouteEventDataCandidate.set(feature, feature.state.selected);
      }
    }

    if (lastRouteEventDataCandidate.size) {
      this.lastRouteEventData = lastRouteEventDataCandidate;
    }
  }

  initSelectedState(mapInstance: MaplibreMap, features: Feature[], featureDataType: FeatureDataType): void {
    const selectedFeatures = features.filter(f => f.properties[SELECTED_PROPERTY_NAME]);
    if (featureDataType === FeatureDataType.ROUTE) {
      selectedFeatures.forEach(feature => {
        this.routeUtilsService.setRelatedRouteFeaturesSelection(mapInstance, feature, true);
      });
      this.lastRouteEventData = new Map(selectedFeatures.map(f => [f, true]));
    }
    if (featureDataType === FeatureDataType.ZONE) {
      this.touchedZoneIds = new Set<number>();
      const featureDatas = this.mapEventUtils.queryFeatureSourceByFilter(mapInstance, FeatureDataType.ZONE, ['==', SELECTED_PROPERTY_NAME, true]);
      featureDatas.forEach(featureData => this.mapEventUtils.setFeatureState(featureData, mapInstance, {selected: true}));
    }
  }

  findSelectedFeatures(): FeaturesSelectEventData {
    return {features: this.mapEventUtils.queryFeaturesByProperty(this.mapInstance, this.layersTypes, feature => feature.state.selected)};
  }

  private setFeatureSelection(data: FeatureData, selected: boolean) {
    if (this.selectionModes.get(data.featureDataType) === SelectionMode.single) {
      // if multiple features of same type, only the last in the list will be selected:
      this.findSelectedFeatures()
        .features.filter(f => f.featureDataType === data.featureDataType)
        .forEach(f => this.mapEventUtils.setFeatureState(f, this.mapInstance, {selected: false}));
    }

    this.mapEventUtils.setFeatureState(data, this.mapInstance, {selected});

    this.routeUtilsService.setRelatedRouteFeaturesSelection(this.mapInstance, data, selected);
  }

  private attachMapMoveEvent() {
    this.complete();
    const mapMove = new Subject();
    this.subscription = mapMove.pipe(sampleTime(MAP_MOVE_SAMPLE_TIME_MS))
      .subscribe(() => {
        let map = this.mapInstance;
        this.lastRouteEventData?.forEach((isSelected, feature) => {
          this.routeUtilsService.setRelatedRouteFeaturesSelection(map, feature, isSelected);
        });
        const featureDatas = this.mapEventUtils.queryFeatureSourceByFilter(map, FeatureDataType.ZONE, ['all',
          ['==', SELECTED_PROPERTY_NAME, true],
          ['!in', '$id', ...this.touchedZoneIds]
        ]);
        featureDatas.forEach(featureData => this.mapEventUtils.setFeatureState(featureData, map, {selected: true}));
      });

    this.mapInstance.on('move', () => mapMove.next());
  }
}

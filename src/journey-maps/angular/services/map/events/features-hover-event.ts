import type Point from '@mapbox/point-geometry';
import { LngLat, Map as MaplibreMap, MapGeoJSONFeature } from 'maplibre-gl';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { sampleTime } from 'rxjs/operators';

import {
  SbbFeatureData,
  SbbFeatureDataType,
  SbbFeaturesHoverChangeEventData,
} from '../../../journey-maps.interfaces';

import { SbbMapEventUtils } from './map-event-utils';
import { SbbRouteUtils } from './route-utils';

const SBB_REPEAT_EVENTS = 1;
const SBB_HOVER_DELAY_TIME = 25;

interface SbbMouseMovedEventData {
  mapEvent: SbbMapEventData;
  hoverState: SbbMouseHoverState;
}

interface SbbMapEventData {
  point: Point;
  lngLat: LngLat;
}

interface SbbMouseHoverState {
  hoveredFeatures: SbbFeatureData[];
}

export class SbbFeaturesHoverEvent extends ReplaySubject<SbbFeaturesHoverChangeEventData> {
  private _subscription: Subscription;

  constructor(
    private _mapInstance: MaplibreMap,
    private _mapEventUtils: SbbMapEventUtils,
    private _layers: Map<string, SbbFeatureDataType>,
    private _routeUtilsService: SbbRouteUtils
  ) {
    super(SBB_REPEAT_EVENTS);
    if (!this._layers.size) {
      return;
    }
    this._attachEvent();
  }

  override complete() {
    super.complete();
    this._subscription?.unsubscribe();
  }

  private _attachEvent(): void {
    const mouseMovedSubject = this._getMouseMovedSubject();
    const hoverState: SbbMouseHoverState = { hoveredFeatures: [] };
    this._mapInstance.on('mousemove', (mapEvent) => {
      mouseMovedSubject.next({
        mapEvent: SbbFeaturesHoverEvent._eventToMapEventData(mapEvent),
        hoverState,
      });
    });
  }

  private _getMouseMovedSubject(): Subject<SbbMouseMovedEventData> {
    const mouseMovedSubject = new Subject<SbbMouseMovedEventData>();
    this._subscription = mouseMovedSubject
      .pipe(sampleTime(SBB_HOVER_DELAY_TIME))
      .subscribe((eventData) => {
        // FIXME: beim click und doppel-click passiert nichts :-(
        this._onHoverChanged(eventData);
      });
    return mouseMovedSubject;
  }

  private _onHoverChanged(eventData: SbbMouseMovedEventData) {
    const event = eventData.mapEvent;
    const state = eventData.hoverState;

    const eventPoint = { x: event.point.x, y: event.point.y };
    const eventLngLat = { lng: event.lngLat.lng, lat: event.lngLat.lat };

    const allHoveredFeatures: SbbFeatureData[] = this._mapEventUtils.queryFeaturesByLayerIds(
      this._mapInstance,
      [eventPoint.x, eventPoint.y],
      this._layers
    );

    // filtered by type/priority
    // (e.g. when hovering lines and points only keep the points)
    const hoveredFeatures = this._mapEventUtils.filterFeaturesByPriority(allHoveredFeatures);

    // Find related route features and add to hovered features
    this._routeUtilsService
      .filterRouteFeatures(hoveredFeatures)
      .map((routeFeature) =>
        this._routeUtilsService.findRelatedRoutes(routeFeature, this._mapInstance, 'visibleOnly')
      )
      .forEach((relatedFeatures) => hoveredFeatures.push(...relatedFeatures));

    // Previously hovered. Keep hovered
    const keepFeatures: SbbFeatureData[] = [];
    // Previously hovered. No longer hovered.
    const removeFeatures: SbbFeatureData[] = [];
    // Newly hovered.
    const newFeatures: SbbFeatureData[] = [];

    for (const current of state.hoveredFeatures) {
      if (
        hoveredFeatures.some((hovered) =>
          SbbFeaturesHoverEvent._featureEventDataEquals(current, hovered)
        )
      ) {
        keepFeatures.push(current);
      } else {
        removeFeatures.push(current);
      }
    }

    // Change feature state for no longer hovered features and raise event.
    if (removeFeatures.length) {
      const data = SbbFeaturesHoverEvent._eventToHoverChangeEventData(
        eventPoint,
        eventLngLat,
        removeFeatures,
        false
      );
      this._setFeatureHoverState(data.features, false);
      this.next(data);
    }

    // Find newly hovered features
    newFeatures.push(
      ...hoveredFeatures.filter(
        (hovered) =>
          !keepFeatures.some((keep) => SbbFeaturesHoverEvent._featureEventDataEquals(keep, hovered))
      )
    );

    this._setFeatureHoverState(newFeatures, true);

    const mergedFeatures = [...keepFeatures, ...newFeatures];

    if (mergedFeatures.length) {
      const data = SbbFeaturesHoverEvent._eventToHoverChangeEventData(
        eventPoint,
        eventLngLat,
        mergedFeatures,
        true
      );

      this.next(data);
    }

    state.hoveredFeatures = mergedFeatures;
  }

  private _setFeatureHoverState(features: MapGeoJSONFeature[], hover: boolean) {
    features.forEach((feature) =>
      this._mapEventUtils.setFeatureState(feature, this._mapInstance, { hover })
    );
  }

  private static _eventToMapEventData(mapEvent: { point: Point; lngLat: LngLat }): SbbMapEventData {
    return {
      point: mapEvent.point,
      lngLat: mapEvent.lngLat,
    };
  }

  private static _eventToHoverChangeEventData(
    eventPoint: { x: number; y: number },
    eventLngLat: { lng: number; lat: number },
    features: SbbFeatureData[],
    hover: boolean
  ): SbbFeaturesHoverChangeEventData {
    const leave = !hover;
    return {
      eventPoint,
      eventLngLat,
      hover,
      leave,
      features: [...features],
    };
  }

  private static _featureEventDataEquals(
    current: MapGeoJSONFeature,
    added: MapGeoJSONFeature
  ): boolean {
    return (
      current.layer.id === added.layer.id &&
      current.source === added.source &&
      current.sourceLayer === added.sourceLayer &&
      current.id === added.id
    );
  }
}

import { LngLat, Map as MaplibreMap, MapboxGeoJSONFeature, Point } from 'maplibre-gl';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { sampleTime } from 'rxjs/operators';

import {
  FeatureData,
  FeatureDataType,
  FeaturesHoverChangeEventData,
} from '../../../journey-maps-client.interfaces';

import { MapEventUtilsService } from './map-event-utils.service';
import { RouteUtilsService } from './route-utils.service';

const REPEAT_EVENTS = 1;
const HOVER_DELAY_TIME = 25;

interface MouseMovedEventData {
  mapEvent: MapEventData;
  hoverState: MouseHoverState;
}

interface MapEventData {
  point: Point;
  lngLat: LngLat;
}

interface MouseHoverState {
  hoveredFeatures: FeatureData[];
}

export class FeaturesHoverEvent extends ReplaySubject<FeaturesHoverChangeEventData> {
  private _subscription: Subscription;

  constructor(
    private _mapInstance: MaplibreMap,
    private _mapEventUtils: MapEventUtilsService,
    private _layers: Map<string, FeatureDataType>,
    private _routeUtilsService: RouteUtilsService
  ) {
    super(REPEAT_EVENTS);
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
    const hoverState: MouseHoverState = { hoveredFeatures: [] };
    this._mapInstance.on('mousemove', (mapEvent) => {
      mouseMovedSubject.next({
        mapEvent: FeaturesHoverEvent._eventToMapEventData(mapEvent),
        hoverState,
      });
    });
  }

  private _getMouseMovedSubject(): Subject<MouseMovedEventData> {
    const mouseMovedSubject = new Subject<MouseMovedEventData>();
    this._subscription = mouseMovedSubject
      .pipe(sampleTime(HOVER_DELAY_TIME))
      .subscribe((eventData) => {
        // FIXME: beim click und doppel-click passiert nichts :-(
        this._onHoverChanged(eventData);
      });
    return mouseMovedSubject;
  }

  private _onHoverChanged(eventData: MouseMovedEventData) {
    const event = eventData.mapEvent;
    const state = eventData.hoverState;

    const eventPoint = { x: event.point.x, y: event.point.y };
    const eventLngLat = { lng: event.lngLat.lng, lat: event.lngLat.lat };

    let currentFeatures: FeatureData[] = this._mapEventUtils.queryFeaturesByLayerIds(
      this._mapInstance,
      [eventPoint.x, eventPoint.y],
      this._layers
    );

    currentFeatures = this._mapEventUtils.filterFeaturesByPriority(currentFeatures);

    let hasNewFeatures = !!currentFeatures.length;

    const routeFeatures = this._routeUtilsService.filterRouteFeatures(currentFeatures);
    if (routeFeatures.length) {
      for (const routeFeature of routeFeatures) {
        const relatedFeatures = this._routeUtilsService.findRelatedRoutes(
          routeFeature,
          this._mapInstance,
          'visibleOnly'
        );
        if (relatedFeatures.length) {
          currentFeatures.push(...relatedFeatures);
        }
      }
    }

    if (state.hoveredFeatures.length) {
      const removeFeatures = state.hoveredFeatures.filter(
        (current) =>
          !currentFeatures.find((added) =>
            FeaturesHoverEvent._featureEventDataEquals(current, added)
          )
      );
      if (removeFeatures.length) {
        const data = FeaturesHoverEvent._eventToHoverChangeEventData(
          eventPoint,
          eventLngLat,
          removeFeatures,
          false
        );
        // leave
        this._setFeatureHoverState(data.features, false);
        this.next(data);
      }
      const newFeatures = currentFeatures.filter(
        (current) =>
          !state.hoveredFeatures.find((added) =>
            FeaturesHoverEvent._featureEventDataEquals(current, added)
          )
      );
      if (newFeatures.length) {
        currentFeatures = newFeatures;
      } else {
        hasNewFeatures = false;
      }
    }
    if (hasNewFeatures && currentFeatures?.length) {
      const data = FeaturesHoverEvent._eventToHoverChangeEventData(
        eventPoint,
        eventLngLat,
        currentFeatures,
        true
      );
      currentFeatures = data.features;
      // hover
      this._setFeatureHoverState(currentFeatures, true);
      this.next(data);
    }

    state.hoveredFeatures = currentFeatures ?? [];
  }

  private _setFeatureHoverState(features: MapboxGeoJSONFeature[], hover: boolean) {
    features.forEach((feature) =>
      this._mapEventUtils.setFeatureState(feature, this._mapInstance, { hover })
    );
  }

  private static _eventToMapEventData(mapEvent: { point: Point; lngLat: LngLat }): MapEventData {
    return {
      point: mapEvent.point,
      lngLat: mapEvent.lngLat,
    };
  }

  private static _eventToHoverChangeEventData(
    eventPoint: { x: number; y: number },
    eventLngLat: { lng: number; lat: number },
    features: FeatureData[],
    hover: boolean
  ): FeaturesHoverChangeEventData {
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
    current: MapboxGeoJSONFeature,
    added: MapboxGeoJSONFeature
  ): boolean {
    return (
      current.layer.id === added.layer.id &&
      current.source === added.source &&
      current.sourceLayer === added.sourceLayer &&
      current.id === added.id
    );
  }
}

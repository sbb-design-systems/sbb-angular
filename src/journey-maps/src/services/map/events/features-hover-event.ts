import {FeatureData, FeatureDataType, FeaturesHoverChangeEventData} from '../../../journey-maps-client.interfaces';
import {LngLat, Map as MaplibreMap, MapboxGeoJSONFeature, Point} from 'maplibre-gl';
import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {MapEventUtilsService} from './map-event-utils.service';
import {RouteUtilsService} from './route-utils.service';
import {sampleTime} from 'rxjs/operators';

const REPEAT_EVENTS = 1;
const HOVER_DELAY_TIME = 25;

interface MouseMovedEventData {
  mapEvent: MapEventData,
  hoverState: MouseHoverState
}

interface MapEventData {
  point: Point,
  lngLat: LngLat
}

interface MouseHoverState {
  hoveredFeatures: FeatureData[];
}

export class FeaturesHoverEvent extends ReplaySubject<FeaturesHoverChangeEventData> {
  private subscription: Subscription;

  constructor(
    private mapInstance: MaplibreMap,
    private mapEventUtils: MapEventUtilsService,
    private layers: Map<string, FeatureDataType>,
    private routeUtilsService: RouteUtilsService
  ) {
    super(REPEAT_EVENTS);
    if (!this.layers.size) {
      return;
    }
    this.attachEvent();
  }

  complete() {
    super.complete();
    this.subscription?.unsubscribe();
  }

  private attachEvent(): void {
    const mouseMovedSubject = this.getMouseMovedSubject();
    const hoverState: MouseHoverState = {hoveredFeatures: []};
    this.mapInstance.on('mousemove', mapEvent => {
      mouseMovedSubject.next({
        mapEvent: FeaturesHoverEvent.eventToMapEventData(mapEvent),
        hoverState
      });
    });
  }

  private getMouseMovedSubject(): Subject<MouseMovedEventData> {
    const mouseMovedSubject = new Subject<MouseMovedEventData>();
    this.subscription = mouseMovedSubject
      .pipe(sampleTime(HOVER_DELAY_TIME)).subscribe(eventData => {
        // FIXME: beim click und doppel-click passiert nichts :-(
        this.onHoverChanged(eventData);
      });
    return mouseMovedSubject;
  }

  private onHoverChanged(eventData: MouseMovedEventData) {
    const event = eventData.mapEvent;
    const state = eventData.hoverState;

    const eventPoint = {x: event.point.x, y: event.point.y};
    const eventLngLat = {lng: event.lngLat.lng, lat: event.lngLat.lat};

    let currentFeatures: FeatureData[] =
      this.mapEventUtils.queryFeaturesByLayerIds(this.mapInstance, [eventPoint.x, eventPoint.y], this.layers);

    currentFeatures = this.mapEventUtils.filterFeaturesByPriority(currentFeatures);

    let hasNewFeatures = !!currentFeatures.length;

    const routeFeatures = this.routeUtilsService.filterRouteFeatures(currentFeatures);
    if (routeFeatures.length) {
      for (let routeFeature of routeFeatures) {
        const relatedFeatures = this.routeUtilsService.findRelatedRoutes(routeFeature, this.mapInstance, 'visibleOnly');
        if (relatedFeatures.length) {
          currentFeatures.push(...relatedFeatures);
        }
      }
    }

    if (state.hoveredFeatures.length) {
      const removeFeatures = state.hoveredFeatures.filter(current => !currentFeatures.find(added => FeaturesHoverEvent.featureEventDataEquals(current, added)));
      if (removeFeatures.length) {
        const eventData = FeaturesHoverEvent.eventToHoverChangeEventData(eventPoint, eventLngLat, removeFeatures, false);
        // leave
        this.setFeatureHoverState(eventData.features, false);
        this.next(eventData);
      }
      const newFeatures = currentFeatures.filter(current => !state.hoveredFeatures.find(added => FeaturesHoverEvent.featureEventDataEquals(current, added)));
      if (newFeatures.length) {
        currentFeatures = newFeatures;
      } else {
        hasNewFeatures = false;
      }
    }
    if (hasNewFeatures && currentFeatures?.length) {
      const eventData = FeaturesHoverEvent.eventToHoverChangeEventData(eventPoint, eventLngLat, currentFeatures, true);
      currentFeatures = eventData.features;
      // hover
      this.setFeatureHoverState(currentFeatures, true);
      this.next(eventData);
    }

    state.hoveredFeatures = currentFeatures ?? [];
  }

  private setFeatureHoverState(features: MapboxGeoJSONFeature[], hover: boolean) {
    features.forEach(feature => this.mapEventUtils.setFeatureState(feature, this.mapInstance, {hover}));
  }

  private static eventToMapEventData(mapEvent): MapEventData {
    return {
      point: mapEvent.point,
      lngLat: mapEvent.lngLat
    };
  }

  private static eventToHoverChangeEventData(
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
      features: [...features]
    };
  }

  private static featureEventDataEquals(current: MapboxGeoJSONFeature, added: MapboxGeoJSONFeature): boolean {
    return current.layer.id === added.layer.id &&
      current.source === added.source &&
      current.sourceLayer === added.sourceLayer &&
      current.id === added.id;
  }
}

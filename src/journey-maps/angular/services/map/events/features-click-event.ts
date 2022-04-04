import { Map as MaplibreMap, MapLayerMouseEvent } from 'maplibre-gl';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SbbFeatureDataType, SbbFeaturesClickEventData } from '../../../journey-maps.interfaces';

import { SbbMapEventUtils } from './map-event-utils';

const SBB_REPEAT_EVENTS = 1;
const SBB_MAP_CLICK_EVENT_DEBOUNCE_TIME = 200;

export class SbbFeaturesClickEvent extends ReplaySubject<SbbFeaturesClickEventData> {
  private _subscription: Subscription;

  constructor(
    private _mapInstance: MaplibreMap,
    private _mapEventUtils: SbbMapEventUtils,
    private _layers: Map<string, SbbFeatureDataType>
  ) {
    super(SBB_REPEAT_EVENTS);
    this._attachEvent();
  }

  override complete() {
    super.complete();
    this._subscription?.unsubscribe();
  }

  private _attachEvent(): void {
    const mapClicked = new Subject<MapLayerMouseEvent>();
    this._subscription = mapClicked
      .pipe(debounceTime(SBB_MAP_CLICK_EVENT_DEBOUNCE_TIME))
      .subscribe((e) => {
        let features = this._mapEventUtils.queryFeaturesByLayerIds(
          this._mapInstance,
          [e.point.x, e.point.y],
          this._layers
        );
        if (!features.length) {
          return;
        }

        features = this._mapEventUtils.filterFeaturesByPriority(features);

        this.next({
          clickPoint: { x: e.point.x, y: e.point.y },
          clickLngLat: { lng: e.lngLat.lng, lat: e.lngLat.lat },
          features: [...features],
        });
      });
    this._mapInstance.on('click', (event) => mapClicked.next(event));
  }
}

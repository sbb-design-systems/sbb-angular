import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LngLatLike, Map as MapLibreMap } from 'maplibre-gl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  FeatureData,
  FeatureDataType,
  FeaturesClickEventData,
  FeaturesHoverChangeEventData,
  FeaturesSelectEventData,
  ListenerOptions,
  ListenerTypeOptions,
  SelectionMode,
} from '../../journey-maps-client.interfaces';
import { FeaturesClickEvent } from '../../services/map/events/features-click-event';
import { FeaturesHoverEvent } from '../../services/map/events/features-hover-event';
import { MapCursorStyleEvent } from '../../services/map/events/map-cursor-style-event';
import { MapEventUtilsService } from '../../services/map/events/map-event-utils.service';
import { MapSelectionEventService } from '../../services/map/events/map-selection-event.service';
import {
  RouteUtilsService,
  ROUTE_ID_PROPERTY_NAME,
} from '../../services/map/events/route-utils.service';
import { MapMarkerService } from '../../services/map/map-marker.service';
import { MapRoutesService } from '../../services/map/map-routes.service';
import { MapStationService } from '../../services/map/map-station.service';
import { MapZoneService } from '../../services/map/map-zone.service';

@Component({
  selector: 'rokas-feature-event-listener',
  templateUrl: './feature-event-listener.component.html',
  providers: [MapSelectionEventService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureEventListenerComponent implements OnChanges, OnDestroy {
  @Input() listenerOptions: ListenerOptions;
  @Input() map: MapLibreMap | null;

  @Output() featureSelectionsChange: EventEmitter<FeaturesSelectEventData> =
    new EventEmitter<FeaturesSelectEventData>();

  @Output() featuresClick: EventEmitter<FeaturesClickEventData> =
    new EventEmitter<FeaturesClickEventData>();
  @Output() featuresHoverChange: EventEmitter<FeaturesHoverChangeEventData> =
    new EventEmitter<FeaturesHoverChangeEventData>();

  overlayVisible: boolean = false;
  overlayEventType: 'click' | 'hover';
  overlayFeatures: FeatureData[];
  overlayPosition: LngLatLike;
  overlayTemplate: any;
  overlayIsPopup: boolean;
  overlayHasMouseFocus: boolean = false;
  overlayTimeoutId: number;

  private _destroyed = new Subject<void>();
  private _watchOnLayers = new Map<string, FeatureDataType>();
  private _mapCursorStyleEvent: MapCursorStyleEvent;
  private _featuresHoverEvent: FeaturesHoverEvent;
  private _featuresClickEvent: FeaturesClickEvent;

  constructor(
    private _mapStationService: MapStationService,
    private _mapRoutesService: MapRoutesService,
    private _mapMarkerService: MapMarkerService,
    private _routeUtilsService: RouteUtilsService,
    private _mapEventUtils: MapEventUtilsService,
    private _cd: ChangeDetectorRef,
    readonly mapSelectionEventService: MapSelectionEventService
  ) {}

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
    this._mapCursorStyleEvent?.complete();
    this._featuresHoverEvent?.complete();
    this._featuresClickEvent?.complete();
    this.mapSelectionEventService?.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.listenerOptions && this.map) {
      this._watchOnLayers.clear();

      if (this.listenerOptions.MARKER?.watch) {
        this._updateWatchOnLayers(
          this._mapMarkerService.allMarkerAndClusterLayers,
          FeatureDataType.MARKER
        );
      }
      if (this.listenerOptions.ROUTE?.watch) {
        this._updateWatchOnLayers(MapRoutesService.ALL_ROUTE_LAYERS, FeatureDataType.ROUTE);
      }
      if (this.listenerOptions.STATION?.watch) {
        this._updateWatchOnLayers([MapStationService.STATION_LAYER], FeatureDataType.STATION);
        this._mapStationService.registerStationUpdater(this.map);
      } else {
        this._mapStationService.deregisterStationUpdater(this.map);
      }
      if (this.listenerOptions.ZONE?.watch) {
        this._updateWatchOnLayers([MapZoneService.ZONE_LAYER], FeatureDataType.ZONE);
      }

      this._mapCursorStyleEvent?.complete();
      this._mapCursorStyleEvent = new MapCursorStyleEvent(this.map, [
        ...this._watchOnLayers.keys(),
      ]);

      const selectionModes = this._listenerOptionsToSelectionModes();
      this.mapSelectionEventService?.complete();
      this.mapSelectionEventService.initialize(this.map, this._watchOnLayers, selectionModes);

      if (!this._featuresClickEvent) {
        this._featuresClickEvent = new FeaturesClickEvent(
          this.map,
          this._mapEventUtils,
          this._watchOnLayers
        );
        this._featuresClickEvent
          .pipe(takeUntil(this._destroyed))
          .subscribe((data) => this._featureClicked(data));
      }

      if (!this._featuresHoverEvent) {
        this._featuresHoverEvent = new FeaturesHoverEvent(
          this.map,
          this._mapEventUtils,
          this._watchOnLayers,
          this._routeUtilsService
        );
        this._featuresHoverEvent
          .pipe(takeUntil(this._destroyed))
          .subscribe((data) => this._featureHovered(data));
      }
    }
  }

  onOverlayMouseEvent(event: 'enter' | 'leave'): void {
    const isLeave = event === 'leave';
    if (isLeave && this.overlayEventType === 'hover') {
      this.overlayVisible = false;
      this._cd.detectChanges();
    }
    this.overlayHasMouseFocus = !isLeave;
  }

  private _updateWatchOnLayers(layers: string[], featureDataType: FeatureDataType): void {
    layers.forEach((id) => this._watchOnLayers.set(id, featureDataType));
  }

  private _listenerOptionsToSelectionModes() {
    const selectionModes = new Map<FeatureDataType, SelectionMode>();
    selectionModes.set(
      FeatureDataType.ROUTE,
      this.listenerOptions.ROUTE?.selectionMode ?? 'single'
    );
    selectionModes.set(
      FeatureDataType.MARKER,
      this.listenerOptions.MARKER?.selectionMode ?? 'single'
    );
    selectionModes.set(
      FeatureDataType.STATION,
      this.listenerOptions.STATION?.selectionMode ?? 'single'
    );
    selectionModes.set(FeatureDataType.ZONE, this.listenerOptions.ZONE?.selectionMode ?? 'multi');
    return selectionModes;
  }

  private _featureClicked(data: FeaturesClickEventData) {
    this.mapSelectionEventService.toggleSelection(data);
    this.featureSelectionsChange.next(this.mapSelectionEventService.findSelectedFeatures());
    this.featuresClick.next(data);

    this._updateOverlay(data.features, 'click', data.clickLngLat);
  }

  private _filterOverlayFeatures(features: FeatureData[], type: FeatureDataType): FeatureData[] {
    const filteredByType = features.filter((f) => f.featureDataType === type);
    if (type !== FeatureDataType.ROUTE) {
      return filteredByType;
    }

    // Only one feature per route id
    return [
      ...new Map(
        filteredByType.map((route) => [route.properties![ROUTE_ID_PROPERTY_NAME], route])
      ).values(),
    ];
  }

  private _featureHovered(data: FeaturesHoverChangeEventData) {
    this.featuresHoverChange.next(data);

    if (data.hover) {
      this._updateOverlay(data.features, 'hover', data.eventLngLat);
    } else if (this.overlayVisible && this.overlayEventType === 'hover') {
      this.overlayTimeoutId = setTimeout(() => {
        if (!this.overlayHasMouseFocus) {
          this.overlayVisible = false;
          this._cd.detectChanges();
        }
      }, 1000);
    }
  }

  private _updateOverlay(
    features: FeatureData[],
    event: 'click' | 'hover',
    pos: { lng: number; lat: number }
  ) {
    const topMostFeature = features[0];
    const listenerTypeOptions: ListenerTypeOptions =
      this.listenerOptions[topMostFeature.featureDataType]!;
    const isClick = event === 'click';
    const template = isClick
      ? listenerTypeOptions?.clickTemplate
      : listenerTypeOptions?.hoverTemplate;

    if (template) {
      clearTimeout(this.overlayTimeoutId);
      this.overlayVisible = true;
      this.overlayEventType = event;
      this.overlayTemplate = template;
      this.overlayFeatures = this._filterOverlayFeatures(features, topMostFeature.featureDataType);
      this.overlayIsPopup = listenerTypeOptions.popup!;

      if (topMostFeature.geometry.type === 'Point') {
        this.overlayPosition = topMostFeature.geometry.coordinates as LngLatLike;
      } else {
        this.overlayPosition = pos;
      }
    } else if (isClick) {
      this.overlayVisible = false;
    }
  }
}

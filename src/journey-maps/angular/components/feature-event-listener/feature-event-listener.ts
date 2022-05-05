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
  SbbFeatureData,
  SbbFeatureDataType,
  SbbFeaturesClickEventData,
  SbbFeaturesHoverChangeEventData,
  SbbFeaturesSelectEventData,
  SbbListenerOptions,
  SbbListenerTypeOptions,
  SbbPointsOfInterestOptions,
  SbbSelectionMode,
} from '../../journey-maps.interfaces';
import { SBB_POI_LAYER } from '../../services/constants';
import { SbbFeaturesClickEvent } from '../../services/map/events/features-click-event';
import { SbbFeaturesHoverEvent } from '../../services/map/events/features-hover-event';
import { SbbMapCursorStyleEvent } from '../../services/map/events/map-cursor-style-event';
import { SbbMapEventUtils } from '../../services/map/events/map-event-utils';
import { SbbMapSelectionEvent } from '../../services/map/events/map-selection-event';
import { SbbRouteUtils, SBB_ROUTE_ID_PROPERTY_NAME } from '../../services/map/events/route-utils';
import { SbbMapMarkerService } from '../../services/map/map-marker-service';
import { SbbMapRoutesService, SBB_ALL_ROUTE_LAYERS } from '../../services/map/map-routes.service';
import { SbbMapStationService, SBB_STATION_LAYER } from '../../services/map/map-station-service';
import { SBB_ZONE_LAYER } from '../../services/map/map-zone-service';

@Component({
  selector: 'sbb-feature-event-listener',
  templateUrl: './feature-event-listener.html',
  providers: [SbbMapSelectionEvent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbFeatureEventListener implements OnChanges, OnDestroy {
  @Input() listenerOptions: SbbListenerOptions;
  @Input() map: MapLibreMap | null;
  @Input() poiOptions?: SbbPointsOfInterestOptions;

  @Output() featureSelectionsChange: EventEmitter<SbbFeaturesSelectEventData> =
    new EventEmitter<SbbFeaturesSelectEventData>();

  @Output() featuresClick: EventEmitter<SbbFeaturesClickEventData> =
    new EventEmitter<SbbFeaturesClickEventData>();
  @Output() featuresHoverChange: EventEmitter<SbbFeaturesHoverChangeEventData> =
    new EventEmitter<SbbFeaturesHoverChangeEventData>();

  overlayVisible: boolean = false;
  overlayEventType: 'click' | 'hover';
  overlayFeatures: SbbFeatureData[];
  overlayPosition: LngLatLike;
  overlayTemplate: any;
  overlayIsPopup: boolean;
  overlayHasMouseFocus: boolean = false;
  overlayTimeoutId: number;

  private _destroyed = new Subject<void>();
  private _watchOnLayers = new Map<string, SbbFeatureDataType>();
  private _mapCursorStyleEvent: SbbMapCursorStyleEvent;
  private _featuresHoverEvent: SbbFeaturesHoverEvent;
  private _featuresClickEvent: SbbFeaturesClickEvent;

  constructor(
    private _mapStationService: SbbMapStationService,
    private _mapRoutesService: SbbMapRoutesService,
    private _mapMarkerService: SbbMapMarkerService,
    private _routeUtilsService: SbbRouteUtils,
    private _mapEventUtils: SbbMapEventUtils,
    private _cd: ChangeDetectorRef,
    readonly mapSelectionEventService: SbbMapSelectionEvent
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
        this._updateWatchOnLayers(this._mapMarkerService.allMarkerAndClusterLayers, 'MARKER');
      }
      if (this.listenerOptions.ROUTE?.watch) {
        this._updateWatchOnLayers(SBB_ALL_ROUTE_LAYERS, 'ROUTE');
      }
      if (this.listenerOptions.STATION?.watch) {
        this._updateWatchOnLayers([SBB_STATION_LAYER], 'STATION');
        this._mapStationService.registerStationUpdater(this.map);
      } else {
        this._mapStationService.deregisterStationUpdater(this.map);
      }
      if (this.listenerOptions.ZONE?.watch) {
        this._updateWatchOnLayers([SBB_ZONE_LAYER], 'ZONE');
      }

      if (this.listenerOptions.POI?.watch) {
        this._updateWatchOnLayers([SBB_POI_LAYER], 'POI');
      }

      this._mapCursorStyleEvent?.complete();
      this._mapCursorStyleEvent = new SbbMapCursorStyleEvent(this.map, [
        ...this._watchOnLayers.keys(),
      ]);

      const selectionModes = this._listenerOptionsToSelectionModes();
      this.mapSelectionEventService?.complete();
      this.mapSelectionEventService.initialize(this.map, this._watchOnLayers, selectionModes);

      if (!this._featuresClickEvent) {
        this._featuresClickEvent = new SbbFeaturesClickEvent(
          this.map,
          this._mapEventUtils,
          this._watchOnLayers
        );
        this._featuresClickEvent
          .pipe(takeUntil(this._destroyed))
          .subscribe((data) => this._featureClicked(data));
      }

      if (!this._featuresHoverEvent) {
        this._featuresHoverEvent = new SbbFeaturesHoverEvent(
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

  private _updateWatchOnLayers(layers: string[], featureDataType: SbbFeatureDataType): void {
    layers.forEach((id) => this._watchOnLayers.set(id, featureDataType));
  }

  private _listenerOptionsToSelectionModes() {
    const selectionModes = new Map<SbbFeatureDataType, SbbSelectionMode>();
    selectionModes.set('ROUTE', this.listenerOptions.ROUTE?.selectionMode ?? 'single');
    selectionModes.set('MARKER', this.listenerOptions.MARKER?.selectionMode ?? 'single');
    selectionModes.set('STATION', this.listenerOptions.STATION?.selectionMode ?? 'single');
    selectionModes.set('ZONE', this.listenerOptions.ZONE?.selectionMode ?? 'multi');
    selectionModes.set('POI', this.listenerOptions.POI?.selectionMode ?? 'single');
    return selectionModes;
  }

  private _featureClicked(data: SbbFeaturesClickEventData) {
    this.mapSelectionEventService.toggleSelection(data.features);
    const selectedFeatures = this.mapSelectionEventService.findSelectedFeatures();
    this.featureSelectionsChange.next(selectedFeatures);
    this.featuresClick.next(data);
    this._updateOverlay(data.features, 'click', data.clickLngLat, selectedFeatures);
  }

  private _filterOverlayFeatures(
    features: SbbFeatureData[],
    type: SbbFeatureDataType
  ): SbbFeatureData[] {
    const filteredByType = features.filter((f) => f.featureDataType === type);
    if (type !== 'ROUTE') {
      return filteredByType;
    }

    // Only one feature per route id
    return [
      ...new Map(
        filteredByType.map((route) => [route.properties![SBB_ROUTE_ID_PROPERTY_NAME], route])
      ).values(),
    ];
  }

  private _featureHovered(data: SbbFeaturesHoverChangeEventData) {
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
    features: SbbFeatureData[],
    event: 'click' | 'hover',
    pos: { lng: number; lat: number },
    selectedFeatures?: SbbFeaturesSelectEventData
  ) {
    const topMostFeature = features[0];
    const featureDataType = topMostFeature.featureDataType;
    const listenerTypeOptions: SbbListenerTypeOptions = this.listenerOptions[featureDataType]!;
    const isClick = event === 'click';
    const template = isClick
      ? listenerTypeOptions?.clickTemplate
      : listenerTypeOptions?.hoverTemplate;

    const selectedIds = (selectedFeatures?.features ?? [])
      .filter((f) => f.featureDataType === featureDataType)
      .map((f) => f.id);

    // If we have a click event then we have to decide if we want to show or hide the overlay.
    const showOverlay =
      !isClick || features.map((f) => f.id).some((id) => selectedIds.includes(id));

    if (template && showOverlay) {
      clearTimeout(this.overlayTimeoutId);
      this.overlayVisible = true;
      this.overlayEventType = event;
      this.overlayTemplate = template;
      this.overlayFeatures = this._filterOverlayFeatures(features, featureDataType);
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

  onOverlayClosed() {
    this.overlayVisible = false;
    if (this.overlayEventType === 'click') {
      this.mapSelectionEventService.toggleSelection(this.overlayFeatures);
      this.featureSelectionsChange.next(this.mapSelectionEventService.findSelectedFeatures());
    }
  }
}

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
import { SbbMapRoutesService } from '../../services/map/map-routes.service';
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
  overlayFeatures: SbbFeatureData[] = [];
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
  private _stationListener: () => void;

  constructor(
    private _mapStationService: SbbMapStationService,
    private _mapRoutesService: SbbMapRoutesService,
    private _mapMarkerService: SbbMapMarkerService,
    private _routeUtilsService: SbbRouteUtils,
    private _mapEventUtils: SbbMapEventUtils,
    private _cd: ChangeDetectorRef,
    readonly mapSelectionEventService: SbbMapSelectionEvent,
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
    this.updateListener();
  }

  updateListener(): void {
    if (this.listenerOptions && this.map) {
      this._watchOnLayers.clear();

      if (this.listenerOptions.MARKER?.watch) {
        this._updateWatchOnLayers(this._mapMarkerService.allMarkerAndClusterLayers, 'MARKER');
      }
      if (this.listenerOptions.ROUTE?.watch) {
        this._updateWatchOnLayers(this._mapRoutesService.getRouteLayerIds(this.map), 'ROUTE');
      }
      if (this.listenerOptions.STATION?.watch) {
        this._updateWatchOnLayers([SBB_STATION_LAYER], 'STATION');
        this._mapStationService.deregisterStationUpdater(this.map, this._stationListener);
        this._stationListener = this._mapStationService.registerStationUpdater(this.map);
      } else {
        this._mapStationService.deregisterStationUpdater(this.map, this._stationListener);
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
          this._watchOnLayers,
        );
        this._featuresClickEvent
          .pipe(takeUntil(this._destroyed))
          .subscribe((clickedFeatures) => this._featureClicked(clickedFeatures));
      }

      if (!this._featuresHoverEvent) {
        this._featuresHoverEvent = new SbbFeaturesHoverEvent(
          this.map,
          this._mapEventUtils,
          this._watchOnLayers,
          this._routeUtilsService,
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

  public selectOrDeselectProgrammatically(
    { features, ...rest }: Omit<SbbFeaturesClickEventData, 'clickPoint'>,
    makeSelected: boolean,
  ) {
    // depending on whether we want these features to be selected or unselected,
    // we toggle the selection state only for those features which previously had the opposite selection status
    const featuresWithOppositeSelectionStatus = features.filter(
      this._getIsSelectedPredicate(!makeSelected),
    );
    if (featuresWithOppositeSelectionStatus.length) {
      this._featureClicked({
        features: featuresWithOppositeSelectionStatus,
        clickPoint: { x: 0, y: 0 }, // dummy values
        ...rest,
      });
    }
  }

  private _getIsSelectedPredicate(isCurrentlySelected: boolean) {
    return (f: SbbFeatureData) => (isCurrentlySelected ? f.state.selected : !f.state.selected);
  }

  private _featureClicked(clickEventData: SbbFeaturesClickEventData) {
    this.mapSelectionEventService.toggleSelection(clickEventData.features);
    const selectedFeatures = this.mapSelectionEventService.findSelectedFeatures();
    this.featureSelectionsChange.next(selectedFeatures);
    this.featuresClick.next(clickEventData);
    this._updateOverlay(
      clickEventData.features,
      'click',
      clickEventData.clickLngLat,
      selectedFeatures,
    );
  }

  // return either all features or ordered by route (in case of multiple routes)
  private _filterOverlayFeatures(
    features: SbbFeatureData[],
    type: SbbFeatureDataType,
  ): SbbFeatureData[] {
    const filteredByType = features.filter((f) => f.featureDataType === type);
    if (type !== 'ROUTE') {
      return filteredByType;
    }

    // Only one feature per route id
    return [
      ...new Map(
        filteredByType.map((route) => [route.properties![SBB_ROUTE_ID_PROPERTY_NAME], route]),
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
    clickedFeatures: SbbFeatureData[],
    event: 'click' | 'hover',
    pos: { lng: number; lat: number },
    selectedFeatures?: SbbFeaturesSelectEventData,
  ) {
    const topMostClickedFeature = clickedFeatures[0];
    const featureDataTypeOfTopMostClickedFeature = topMostClickedFeature.featureDataType;
    const listenerTypeOptions: SbbListenerTypeOptions =
      this.listenerOptions[featureDataTypeOfTopMostClickedFeature]!;
    const isClick = event === 'click';
    const template = isClick
      ? listenerTypeOptions?.clickTemplate
      : listenerTypeOptions?.hoverTemplate;
    const showOverlay =
      !isClick ||
      this._anySelectedClickedFeatureHasSameTypeAsTopClickedFeature(
        clickedFeatures,
        featureDataTypeOfTopMostClickedFeature,
        selectedFeatures,
      );

    if (template && showOverlay) {
      clearTimeout(this.overlayTimeoutId);
      this.overlayVisible = true;
      this.overlayEventType = event;
      this.overlayTemplate = template;
      this.overlayFeatures = this._filterOverlayFeatures(
        clickedFeatures,
        featureDataTypeOfTopMostClickedFeature,
      );
      this.overlayIsPopup = listenerTypeOptions.popup!;

      if (topMostClickedFeature.geometry.type === 'Point') {
        this.overlayPosition = topMostClickedFeature.geometry.coordinates as LngLatLike;
      } else {
        this.overlayPosition = pos;
      }
    } else if (isClick) {
      this.overlayVisible = false;
    }
    this._cd.detectChanges();
  }

  // this method seems to return true if any of the clicked features is selected and has the same
  // SbbFeatureDataType as the top-most clicked feature.
  private _anySelectedClickedFeatureHasSameTypeAsTopClickedFeature(
    clickedFeatures: SbbFeatureData[],
    topClickedFeatureType: SbbFeatureDataType,
    selectedFeatures?: { features: SbbFeatureData[] | undefined },
  ): boolean {
    const selectedIdsOfSameFeatureTypeAsTopClicked = this._idsOfFeatureWithSameFeatureDataType(
      selectedFeatures?.features,
      topClickedFeatureType,
    );
    return this._anyFeaturesWithSameId(clickedFeatures, selectedIdsOfSameFeatureTypeAsTopClicked);
  }

  private _idsOfFeatureWithSameFeatureDataType(
    features: SbbFeatureData[] | undefined,
    featureDataType: SbbFeatureDataType,
  ): (string | number | undefined)[] {
    return this._featuresWithSameFeatureDataType(features, featureDataType).map(
      (feature) => feature.id,
    );
  }

  private _featuresWithSameFeatureDataType(
    features: SbbFeatureData[] | undefined,
    featureDataType: SbbFeatureDataType,
  ) {
    return (features ?? []).filter((feature) => feature.featureDataType === featureDataType);
  }

  private _anyFeaturesWithSameId(features: SbbFeatureData[], ids: (string | number | undefined)[]) {
    return features.map((feature) => feature.id).some((id) => ids.includes(id));
  }

  onOverlayClosed() {
    this.overlayVisible = false;
    if (this.overlayEventType === 'click') {
      // if a popup or teaser overlay was closed,
      this.mapSelectionEventService.toggleSelection(this.overlayFeatures);
      this.overlayFeatures = [];
      this.featureSelectionsChange.next(this.mapSelectionEventService.findSelectedFeatures());
    }
    this._cd.detectChanges();
  }
}

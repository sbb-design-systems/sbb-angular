import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FeatureCollection, Point } from 'geojson';
import { LngLatBounds, LngLatLike, Map as MaplibreMap, VectorTileSource } from 'maplibre-gl';
import { merge, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, take, takeUntil } from 'rxjs/operators';

import { SbbFeatureEventListener } from './components/feature-event-listener/feature-event-listener';
import { SbbLevelSwitcher } from './components/level-switch/services/level-switcher';
import { SbbMapLayerFilter } from './components/level-switch/services/map-layer-filter';
import { SbbGeolocateControl } from './controls/sbbGeolocateControl';
import {
  SbbDeselectableFeatureDataType,
  SbbFeatureData,
  SbbFeaturesClickEventData,
  SbbFeaturesHoverChangeEventData,
  SbbFeaturesSelectEventData,
  SbbInteractionOptions,
  SbbJourneyMapsRoutingOptions,
  SbbListenerOptions,
  SbbMarkerOptions,
  SbbPointsOfInterestOptions,
  SbbStyleOptions,
  SbbTemplateType,
  SbbUIOptions,
  SbbViewportBounds,
  SbbViewportDimensions,
  SbbZoomLevels,
} from './journey-maps.interfaces';
import { SbbMarker } from './model/marker';
import { sbbBufferTimeOnValue } from './services/bufferTimeOnValue';
import {
  SBB_BOUNDING_BOX,
  SBB_JOURNEY_POIS_SOURCE,
  SBB_MAX_ZOOM,
  SBB_MIN_ZOOM,
  SBB_POI_ID_PROPERTY,
  SBB_POI_LAYER,
  SBB_ROKAS_ROUTE_SOURCE,
} from './services/constants';
import { SbbLocaleService } from './services/locale-service';
import { SbbMapEventUtils } from './services/map/events/map-event-utils';
import { SbbMapConfig } from './services/map/map-config';
import { SbbMapInitService } from './services/map/map-init-service';
import { SbbMapJourneyService } from './services/map/map-journey-service';
import { SbbMapLeitPoiService } from './services/map/map-leit-poi-service';
import { SbbMapMarkerService } from './services/map/map-marker-service';
import { SbbMapOverflowingLabelService } from './services/map/map-overflowing-label-service';
import { SbbMapRailNetworkLayerService } from './services/map/map-rail-network-layer.service';
import { SbbMapRoutesService } from './services/map/map-routes.service';
import { SbbMapService } from './services/map/map-service';
import { SbbMapTransferService } from './services/map/map-transfer-service';
import { SbbMapUrlService } from './services/map/map-url-service';
import { SbbMapZoneService } from './services/map/map-zone-service';
import { MarkerOrPoiSelectionStateService } from './services/map/marker-or-poi-selection-state.service';
import { getInvalidRoutingOptionCombination } from './util/input-validation';
import { isSbbBoundingBoxOptions, isSbbMapCenterOptions } from './util/typeguard';

/**
 * This component uses the Maplibre GL JS api to render a map and display the given data on the map.
 */
@Component({
  selector: 'sbb-journey-maps',
  templateUrl: './journey-maps.html',
  styleUrls: ['./journey-maps.css'],
  providers: [
    SbbLevelSwitcher,
    SbbMapLayerFilter,
    SbbMapLeitPoiService,
    MarkerOrPoiSelectionStateService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbJourneyMaps implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  /** Your personal API key. Ask <a href="mailto:dlrokas@sbb.ch">dlrokas@sbb.ch</a> if you need one. */
  @Input() apiKey: string;
  /**
   * Input to display JourneyMaps GeoJson routing data on the map.
   *
   * **WARNING:** The map currently doesn't support more than one of these fields to be set at a time
   */
  @Input() journeyMapsRoutingOption?: SbbJourneyMapsRoutingOptions;
  /**
   * Input to display JourneyMaps GeoJson zone data on the map.
   */
  @Input() journeyMapsZones?: FeatureCollection;
  /**
   * Custom <code>ng-template</code> for the marker details. (Popup or Teaser)
   * See examples for details.
   *
   * <b>NOTE:</b> This does not work - at the moment - when using the Web Component version of the library.
   */
  @Input() markerDetailsTemplate?: SbbTemplateType;
  /** Which (floor-)level should be shown */
  @Input() selectedLevel: number;
  @Input() listenerOptions: SbbListenerOptions;
  /**
   * Specify which points of interest categories should be visible in map.
   */
  @Input() poiOptions?: SbbPointsOfInterestOptions;
  /** Define the currently visible part of the map. */
  @Input() viewportDimensions?: SbbViewportDimensions;
  /** Restrict the visible part and possible zoom levels of the map. */
  @Input() viewportBounds?: SbbViewportBounds;
  /**
   * This event is emitted whenever a marker, with property triggerEvent, is selected or unselected.
   */
  @Output() selectedMarkerIdChange: EventEmitter<string> = new EventEmitter<string>();
  /**
   * This event is emitted whenever the selected (floor-) level changes.
   */
  @Output() selectedLevelChange: EventEmitter<number> = new EventEmitter<number>();
  /**
   * This event is emitted whenever the selected features changes.
   */
  @Output() selectedFeaturesChange: EventEmitter<SbbFeaturesSelectEventData> =
    new EventEmitter<SbbFeaturesSelectEventData>();
  /**
   * This event is emitted whenever map features were clicked.
   */
  @Output() featuresClick: EventEmitter<SbbFeaturesClickEventData> =
    new EventEmitter<SbbFeaturesClickEventData>();
  /**
   * This event is emitted whenever mouse hovered or leaved map features.
   */
  @Output() featuresHoverChange: EventEmitter<SbbFeaturesHoverChangeEventData> =
    new EventEmitter<SbbFeaturesHoverChangeEventData>();
  /**
   * This event is emitted whenever the list of available (floor-) levels changes
   */
  @Output() visibleLevelsChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  /**
   * This event is emitted whenever any of the {@link SbbViewportDimensions} changes
   */
  @Output() viewportDimensionsChange: EventEmitter<SbbViewportDimensions> =
    new EventEmitter<SbbViewportDimensions>();
  /**
   * This event is emitted whenever one of the {@link SbbZoomLevels} of the map has changed.
   * @deprecated use viewportDimensionsChange instead
   */
  @Output() zoomLevelsChange: EventEmitter<SbbZoomLevels> = new EventEmitter<SbbZoomLevels>();
  /**
   * This event is emitted whenever the center of the map has changed. (Whenever the map has been moved)
   * @deprecated use viewportDimensionsChange instead
   */
  @Output() mapCenterChange: EventEmitter<LngLatLike> = new EventEmitter<LngLatLike>();
  /**
   * This event is emitted whenever the map is ready.
   */
  @Output() mapReady: ReplaySubject<MaplibreMap> = new ReplaySubject<MaplibreMap>(1);
  /**
   * This event is emitted whenever the bounds of the map have changed. (Whenever the map has been moved)
   * @deprecated use viewportDimensionsChange instead
   */
  @Output() mapBoundsChange: EventEmitter<number[][]> = new EventEmitter<number[][]>();

  // visible for testing
  /** @docs-private */
  touchEventCollector: Subject<TouchEvent> = new Subject<TouchEvent>();
  /** @docs-private */
  touchOverlayText: string;
  /** @docs-private */
  touchOverlayStyleClass: string = '';

  private _map: MaplibreMap;
  @ViewChild('map') private _mapElementRef: ElementRef<HTMLElement>;
  @ViewChild(SbbFeatureEventListener)
  private _featureEventListenerComponent: SbbFeatureEventListener;
  private _defaultStyleOptions: SbbStyleOptions = {
    url: 'https://journey-maps-tiles.geocdn.sbb.ch/styles/{styleId}/style.json?api_key={apiKey}',
    aerialId: 'aerial_sbb_ki_v2',
    brightId: 'base_bright_v2_ki_v2',
    darkId: 'base_dark_v2_ki_v2',
    mode: 'bright',
  };
  private _defaultInteractionOptions: SbbInteractionOptions = {
    /** Mobile-friendly default: you get a message-overlay if you try to pan with one finger. */
    oneFingerPan: false,
    scrollZoom: true,
  };
  private _defaultUIOptions: SbbUIOptions = {
    showSmallButtons: false,
    levelSwitch: true,
    zoomControls: true,
    basemapSwitch: true,
    homeButton: false,
    geoLocation: false,
  };
  private _defaultHomeButtonOptions: SbbViewportDimensions = {
    boundingBox: SBB_BOUNDING_BOX,
  };
  private _defaultMarkerOptions: SbbMarkerOptions = {
    popup: false,
  };
  private _zoomLevelDebouncer = new Subject<void>();
  private _mapMovementDebouncer = new Subject<void>();
  private _mapResized = new Subject<void>();
  private _destroyed = new Subject<void>();
  private _styleLoaded = new ReplaySubject<void>(1);
  private _viewportDimensionsChanged = new Subject<void>();
  private _mapStyleOptionsChanged = new Subject<void>();
  // _map._isStyleLoaded() returns sometimes false when sources are being updated.
  // Therefore, we set this variable to true once the style has been loaded.
  private _isStyleLoaded = false;
  private _isAerialSelected = false;
  private _observer: ResizeObserver;
  private _sbbGeolocateControl = new SbbGeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  });

  constructor(
    private _mapInitService: SbbMapInitService,
    private _mapConfigService: SbbMapConfig,
    private _mapService: SbbMapService,
    private _mapMarkerService: SbbMapMarkerService,
    private _mapJourneyService: SbbMapJourneyService,
    private _mapTransferService: SbbMapTransferService,
    private _mapRoutesService: SbbMapRoutesService,
    private _mapRailNetworkLayerService: SbbMapRailNetworkLayerService,
    private _mapZoneService: SbbMapZoneService,
    private _mapLeitPoiService: SbbMapLeitPoiService,
    private _mapLayerFilterService: SbbMapLayerFilter,
    private _mapOverflowingLabelService: SbbMapOverflowingLabelService,
    private _mapEventUtils: SbbMapEventUtils,
    private _urlService: SbbMapUrlService,
    private _levelSwitchService: SbbLevelSwitcher,
    private _markerOrPoiSelectionStateService: MarkerOrPoiSelectionStateService,
    private _cd: ChangeDetectorRef,
    private _i18n: SbbLocaleService,
    private _host: ElementRef,
  ) {
    // binding of 'this' is needed for elements/webcomponent
    // https://github.com/angular/angular/issues/22114#issuecomment-569311422
    this._host.nativeElement.moveNorth = this.moveNorth.bind(this);
    this._host.nativeElement.moveEast = this.moveEast.bind(this);
    this._host.nativeElement.moveSouth = this.moveSouth.bind(this);
    this._host.nativeElement.moveWest = this.moveWest.bind(this);
    this._host.nativeElement.zoomIn = this.zoomIn.bind(this);
    this._host.nativeElement.zoomOut = this.zoomOut.bind(this);
    this._host.nativeElement.unselectAll = this.unselectAll.bind(this);
    this._host.nativeElement.setSelectedPoi = this.setSelectedPoi.bind(this);
  }

  private _styleOptions: SbbStyleOptions = this._defaultStyleOptions;

  /**
   * Settings to control the map (bright and dark) styles
   */
  @Input()
  get styleOptions(): SbbStyleOptions {
    return this._styleOptions;
  }

  set styleOptions(styleOptions: SbbStyleOptions) {
    this._styleOptions = {
      ...this._defaultStyleOptions,
      ...styleOptions,
    };
  }

  /**
   * The language used for localized labels.
   * Allowed values are <code>de</code>, <code>fr</code>, <code>it</code>, <code>en</code>.
   */
  @Input()
  get language(): string {
    return this._i18n.language;
  }

  set language(language: string) {
    if (language == null) {
      throw new TypeError('language must not be null');
    }

    language = language.toLowerCase();
    if (language === 'de' || language === 'fr' || language === 'it' || language === 'en') {
      this._i18n.language = language;
    } else {
      throw new TypeError('Illegal value for language. Allowed values are de|fr|it|en.');
    }
  }

  private _interactionOptions: SbbInteractionOptions = this._defaultInteractionOptions;

  /**
   * Settings to control the movement of the map by means other than via the buttons on the _map
   */
  @Input()
  get interactionOptions(): SbbInteractionOptions {
    return this._interactionOptions;
  }

  set interactionOptions(interactionOptions: SbbInteractionOptions) {
    this._interactionOptions = {
      ...this._defaultInteractionOptions,
      ...interactionOptions,
    };
  }

  private _uiOptions: SbbUIOptions = this._defaultUIOptions;

  /**
   * Settings to control which control buttons are shown on the _map
   */
  @Input()
  get uiOptions(): SbbUIOptions {
    return this._uiOptions;
  }

  set uiOptions(uiOptions: SbbUIOptions) {
    this._uiOptions = {
      ...this._defaultUIOptions,
      ...uiOptions,
    };
  }

  private _homeButtonOptions: SbbViewportDimensions = this._defaultHomeButtonOptions;

  /** Settings that control what portion of the map is shown when the home button is clicked. */
  @Input()
  get homeButtonOptions(): SbbViewportDimensions {
    return this._homeButtonOptions;
  }

  set homeButtonOptions(homeButtonOptions: SbbViewportDimensions) {
    this._homeButtonOptions = {
      ...this._defaultHomeButtonOptions,
      ...homeButtonOptions,
    };
  }

  private _markerOptions: SbbMarkerOptions = this._defaultMarkerOptions;

  /**
   * Settings to control interacting with markers on the _map
   */
  @Input()
  get markerOptions(): SbbMarkerOptions {
    return this._markerOptions;
  }

  set markerOptions(markerOptions: SbbMarkerOptions) {
    this._markerOptions = {
      ...this._defaultMarkerOptions,
      ...markerOptions,
    };
  }

  /**
   * Select one of the markers contained in {@link SbbJourneyMaps#markers}
   *
   * Allowed values are either the ID of a marker to select or <code>undefined</code> to unselect.
   */
  @Input()
  get selectedMarkerId(): string | undefined {
    // without this getter, the setter is never called when passing 'undefined' (via the 'elements' web component)
    return this._markerOrPoiSelectionStateService.getSelectedSbbMarker()?.id;
  }

  set selectedMarkerId(markerId: string | undefined) {
    if (!!markerId) {
      const selectedMarker = this.markerOptions.markers?.find((marker) => marker.id === markerId);
      this.onMarkerSelected(selectedMarker!);
    } else if (!!this.selectedMarker) {
      this.onMarkerUnselected();
    }
  }

  /** The currently selected map marker or undefined if none is selected. */
  get selectedMarker(): SbbMarker | undefined {
    return this._markerOrPoiSelectionStateService.getSelectedSbbMarker();
  }

  set selectedMarker(value: SbbMarker | undefined) {
    if (value && (value.triggerEvent || value.triggerEvent === undefined)) {
      this.selectedMarkerIdChange.emit(value.id);
    } else {
      // Promise: workaround to prevent ExpressionChangedAfterItHasBeenCheckedError in client after POI was selected
      Promise.resolve().then(() => this.selectedMarkerIdChange.emit(undefined));
    }
    if (!value) {
      this._markerOrPoiSelectionStateService.deselectSbbMarker();
    } else if (value && value.markerUrl) {
      open(value.markerUrl, '_self');
    } else {
      this._unselectPoi();
      this._markerOrPoiSelectionStateService.selectSbbMarker(value);
    }
  }

  /** @docs-private */
  get getMarkersBounds(): LngLatBounds | undefined {
    return this.markerOptions.zoomToMarkers
      ? this.computeMarkersBounds(this.markerOptions.markers)
      : undefined;
  }

  /** @docs-private */
  onTouchStart(event: TouchEvent): void {
    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    if (!this.interactionOptions.oneFingerPan) {
      this._map.dragPan.disable();
    }
    this.touchEventCollector.next(event);
  }

  /** @docs-private */
  onTouchEnd(event: TouchEvent): void {
    this.touchOverlayStyleClass = '';
    this.touchEventCollector.next(event);
  }

  /**
   * Move the map North as if pressing the up arrow key on the keyboard
   */
  moveNorth(): void {
    this._mapService.pan(this._map, 'north');
  }

  /**
   * Move the map East as if pressing the right arrow key on the keyboard
   */
  moveEast(): void {
    this._mapService.pan(this._map, 'east');
  }

  /**
   * Move the map South as if pressing the down arrow key on the keyboard
   */
  moveSouth(): void {
    this._mapService.pan(this._map, 'south');
  }

  /**
   * Move the map West as if pressing the left arrow key on the keyboard
   */
  moveWest(): void {
    this._mapService.pan(this._map, 'west');
  }

  /**
   * Zoom In
   */
  zoomIn(): void {
    this._map?.zoomIn();
  }

  /**
   * Zoom Out
   */
  zoomOut(): void {
    this._map?.zoomOut();
  }

  /**
   * Unselects all elements on the map that are of one of the `SbbFeatureDataType`s passed in as a parameter.
   * Currently, we only support 'MARKER' and 'POI'.
   */
  unselectAll(types: SbbDeselectableFeatureDataType[]): void {
    // unselect markers
    if (types.includes('MARKER')) {
      this.onMarkerUnselected();
    }
    // unselect pois
    if (types.includes('POI')) {
      this._unselectPoi();
    }
  }

  /**
   * Programmatically select a POI by providing the SBB-ID of the POI.
   * Only works for POIs that are currently visible in the map's viewport.
   */
  setSelectedPoi(sbbId: string | undefined) {
    if (!!sbbId) {
      this._selectOrDeselectPoi(sbbId, true);
    } else {
      this._unselectPoi();
    }
  }

  private _unselectPoi() {
    const selectedPoi = this._markerOrPoiSelectionStateService.getSelectedPoi();
    if (selectedPoi) {
      this._selectOrDeselectPoi(selectedPoi?.id, false);
    }
  }

  private _selectOrDeselectPoi(sbbId: string, makeSelected: boolean) {
    if (!!sbbId) {
      const visiblePoiFeatures = this._mapEventUtils.queryVisibleFeaturesByFilter(
        this._map,
        'POI',
        [SBB_POI_LAYER],
        ['==', SBB_POI_ID_PROPERTY, sbbId],
      );
      if (visiblePoiFeatures.length) {
        const coordinates = (visiblePoiFeatures[0].geometry as Point).coordinates;
        this._featureEventListenerComponent.selectOrDeselectProgrammatically(
          {
            clickLngLat: { lng: coordinates[0], lat: coordinates[1] },
            features: visiblePoiFeatures,
          },
          makeSelected,
        );
      }
    }
  }

  ngOnInit(): void {
    this._validateInputParameter();
    this._setupSubjects();
    this._executeWhenMapStyleLoaded(() => {
      this._mapOverflowingLabelService.hideOverflowingLabels(this._map, this.interactionOptions);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._mapConfigService.updateConfigs(this.markerOptions.popup);

    if (
      changes.markerOptions?.currentValue.markers !== changes.markerOptions?.previousValue?.markers
    ) {
      this._updateMarkers();
    }

    // handle journey, transfer, and routes together, otherwise they can overwrite each other's transfer or route data
    if (changes.journeyMapsRoutingOption) {
      const invalidKeyCombination = getInvalidRoutingOptionCombination(
        this.journeyMapsRoutingOption ?? {},
      );
      if (invalidKeyCombination.length) {
        console.error(
          `journeyMapsRoutingOption: Use only one of the following: 'transfer', 'journey', 'routes'. Received: ` +
            invalidKeyCombination.map((key) => `'${key}'`).join(', '),
        );
      } else {
        if (this._haveRoutesMetaInformationsChanged(changes)) {
          this._updateMarkers();
        }

        this._executeWhenMapStyleLoaded(() => {
          // stam: is there other way to achieve this ?
          const mapSelectionEventService =
            this._featureEventListenerComponent.mapSelectionEventService;

          // remove previous data from map
          this._mapJourneyService.updateJourney(this._map, mapSelectionEventService, undefined);
          this._mapTransferService.updateTransfer(this._map, undefined);
          this._mapRoutesService.updateRoutes(this._map, mapSelectionEventService, undefined);
          this._mapLeitPoiService.processData(this._map, undefined);
          // only add new data if we have some
          if (
            changes.journeyMapsRoutingOption.currentValue?.journey ||
            changes.journeyMapsRoutingOption.currentValue?.journeyMetaInformation
          ) {
            this._updateJourney();
          }
          if (changes.journeyMapsRoutingOption.currentValue?.transfer) {
            this._updateTransfer();
          }
          if (changes.journeyMapsRoutingOption.currentValue?.routes) {
            this._updateRoutes();
          }
        });
      }
    }

    if (changes.journeyMapsZones?.currentValue || changes.journeyMapsZones?.previousValue) {
      this._executeWhenMapStyleLoaded(() => {
        this._updateZones();
      });
    }

    if (changes.poiOptions) {
      this._executeWhenMapStyleLoaded(() => {
        const poiEnvironmentChanged =
          changes.poiOptions.previousValue?.environment !==
          changes.poiOptions.currentValue?.environment;
        const poiPreviewChanged =
          changes.poiOptions.previousValue?.includePreview !==
          changes.poiOptions.currentValue?.includePreview;
        const poiStyleOptionsChanged =
          !changes.poiOptions.firstChange && (poiEnvironmentChanged || poiPreviewChanged);

        if (poiStyleOptionsChanged) {
          // Update POI-Source-URL
          const currentPoiSource = this._map.getSource(SBB_JOURNEY_POIS_SOURCE) as VectorTileSource;
          const newPoiSourceUrl = this._urlService.getPoiSourceUrlByOptions(
            currentPoiSource.url,
            this.poiOptions,
          );
          currentPoiSource.setUrl(newPoiSourceUrl);
          this._map.once('styledata', () => {
            this._mapService.updatePoiVisibility(this._map, this.poiOptions);
          });
        } else {
          // Else load instantly
          this._mapService.updatePoiVisibility(this._map, this.poiOptions);
        }
      });
    }

    if (!this._isStyleLoaded) {
      return;
    }

    if (
      JSON.stringify(changes.viewportDimensions?.currentValue) !==
      JSON.stringify(changes.viewportDimensions?.previousValue)
    ) {
      this._viewportDimensionsChanged.next();
    }

    if (changes.viewportBounds) {
      this._executeWhenMapStyleLoaded(() => {
        this._map
          .setMinZoom(this.viewportBounds?.minZoomLevel ?? SBB_MIN_ZOOM)
          .setMaxZoom(this.viewportBounds?.maxZoomLevel ?? SBB_MAX_ZOOM)
          .setMaxBounds(this.viewportBounds?.maxBounds);
        this._zoomLevelDebouncer.next();
      });
    }

    if (
      JSON.stringify(changes.styleOptions?.currentValue) !==
      JSON.stringify(changes.styleOptions?.previousValue)
    ) {
      this._mapStyleOptionsChanged.next();
    }

    if (changes.selectedLevel?.currentValue !== undefined) {
      this._levelSwitchService.switchLevel(this.selectedLevel);
    }

    if (
      changes.uiOptions?.currentValue.levelSwitch !== changes.uiOptions?.previousValue.levelSwitch
    ) {
      this._show2Dor3D();
    }
  }

  ngAfterViewInit(): void {
    const styleUrl = this._getStyleUrl();

    this.touchOverlayText = this._i18n.getText('touchOverlay.tip');
    this._mapInitService
      .initializeMap(
        this._mapElementRef.nativeElement,
        this._i18n.language,
        styleUrl,
        this.interactionOptions,
        this.viewportDimensions,
        this.viewportBounds,
        this.getMarkersBounds,
        this.poiOptions,
      )
      .subscribe((m) => {
        this._map = m;
        if (this._map.isStyleLoaded()) {
          this._onStyleLoaded();
        } else {
          this._map.on('styledata', () => {
            this._onStyleLoaded();
          });
        }
      });

    this.touchEventCollector
      .pipe(sbbBufferTimeOnValue(200), takeUntil(this._destroyed))
      .subscribe((touchEvents) => {
        const containsTwoFingerTouch = touchEvents.some(
          (touchEvent) => touchEvent.touches.length === 2,
        );
        const containsTouchEnd = touchEvents.some((touchEvent) => touchEvent.type === 'touchend');

        if (
          !(containsTwoFingerTouch || containsTouchEnd) &&
          !this.interactionOptions.oneFingerPan
        ) {
          this.touchOverlayStyleClass = 'is_visible';
          this._cd.detectChanges();
        }
      });

    this._setupResizeObserver();
  }

  ngOnDestroy(): void {
    this._observer?.disconnect();
    this._map?.remove();

    this._destroyed.next();
    this._destroyed.complete();
    this._mapLeitPoiService.destroy();
    this._levelSwitchService.destroy();
  }

  /**
   * When a marker has been unselected from outside the map.
   * @docs-private
   */
  onMarkerUnselected(): void {
    this.selectedMarker = undefined;
    this._mapMarkerService.unselectFeature(this._map);
    this._cd.detectChanges();
  }

  /**
   * When a marker has been selected from outside the map.
   * @docs-private
   */
  onMarkerSelected(marker: SbbMarker): void {
    if (marker?.id !== this.selectedMarkerId) {
      this.selectedMarker = marker;
      this._mapMarkerService.selectMarker(this._map, marker);
      this._cd.detectChanges();
    }
  }

  /** @docs-private */
  computeMarkersBounds(markers: SbbMarker[] | undefined): LngLatBounds {
    const bounds = new LngLatBounds();
    markers?.forEach((marker: SbbMarker) => {
      bounds.extend(marker.position as LngLatLike);
    });
    return bounds;
  }

  /** @docs-private */
  onToggleBasemap() {
    this._isAerialSelected = !this._isAerialSelected;
    this._mapStyleOptionsChanged.next();
  }

  /** @docs-private */
  handleMarkerOrClusterClick(features: SbbFeatureData[]) {
    const featureEventDataList = features.filter((feature) =>
      this._mapMarkerService.allMarkerAndClusterLayers.includes(feature.layer.id),
    );

    if (!featureEventDataList.length) {
      return;
    }

    let i = 0;
    let target = featureEventDataList[0];
    // The topmost rendered feature should be at position 0.
    // But it doesn't work for featureEventDataList within the same layer.
    while (target.layer.id === featureEventDataList[++i]?.layer.id) {
      if (target.properties?.order < featureEventDataList[i].properties?.order) {
        target = featureEventDataList[i];
      }
    }

    if (target.properties?.cluster) {
      this._mapMarkerService.onClusterClicked(this._map, target);
    } else {
      const selectedMarkerId = this._mapMarkerService.onMarkerClicked(
        this._map,
        target,
        this.selectedMarkerId,
      );
      this.selectedMarker = this.markerOptions.markers?.find(
        (marker) => marker.id === selectedMarkerId && !!selectedMarkerId,
      );
      this._cd.detectChanges();
    }
  }

  /** @docs-private */
  onHomeButtonClicked() {
    this._mapService.moveMap(this._map, this._homeButtonOptions);
  }

  /** @docs-private */
  onGeolocateButtonClicked() {
    this._sbbGeolocateControl.trigger();
  }

  private _updateMarkers(): void {
    this.selectedMarker = this.markerOptions.markers?.find(
      (marker) => this.selectedMarkerId === marker.id,
    );
    this._executeWhenMapStyleLoaded(() => {
      this._mapMarkerService.updateMarkers(
        this._map,
        this._getMarkers(),
        this.selectedMarker,
        this.styleOptions.mode,
      );
      this._cd.detectChanges();
    });
  }

  private _executeWhenMapStyleLoaded(callback: () => void): void {
    if (this._isStyleLoaded) {
      callback();
    } else {
      this._styleLoaded.pipe(take(1), delay(500)).subscribe(() => callback());
    }
  }

  private _getStyleUrl(): string {
    return this.styleOptions
      .url!.replace('{styleId}', this._getStyleId()!)
      .replace('{apiKey}', this.apiKey);
  }

  private _getStyleId(): string | undefined {
    return this._isAerialSelected
      ? this.styleOptions.aerialId
      : this.styleOptions.mode === 'dark'
      ? this.styleOptions.darkId
      : this.styleOptions.brightId;
  }

  private _setupSubjects(): void {
    this._mapResized
      .pipe(debounceTime(500), takeUntil(this._destroyed))
      .subscribe(() => this._map?.resize());

    this._viewportDimensionsChanged
      .pipe(debounceTime(200), takeUntil(this._destroyed))
      .subscribe(() => {
        if (this.viewportDimensions) {
          this._mapService.moveMap(this._map, this.viewportDimensions);
        }
      });

    this._mapStyleOptionsChanged
      .pipe(
        debounceTime(200),
        switchMap(() => this._mapInitService.fetchStyle(this._getStyleUrl(), this.poiOptions)),
        takeUntil(this._destroyed),
      )
      .subscribe((style) => {
        this._map.setStyle(style, { diff: false });
        this._map.once('styledata', () => {
          this._featureEventListenerComponent.updateListener();
          this._show2Dor3D();
          this._mapMarkerService.updateMarkers(
            this._map,
            this._getMarkers(),
            this.selectedMarker,
            this.styleOptions.mode,
          );
          this._mapLayerFilterService.collectLvlLayers();
          this._levelSwitchService.switchLevel(this._levelSwitchService.selectedLevel);
          if (this.journeyMapsRoutingOption?.journey) {
            this._updateJourney();
          } else if (this.journeyMapsRoutingOption?.transfer) {
            this._updateTransfer();
          } else if (this.journeyMapsRoutingOption?.routes) {
            this._updateRoutes();
          }
          if (this.journeyMapsZones) {
            this._updateZones();
          }
          if (this.styleOptions.railNetwork) {
            this._mapRailNetworkLayerService.updateOptions(
              this._map,
              this.styleOptions.railNetwork,
            );
          }
        });
      });

    this._zoomLevelDebouncer.pipe(debounceTime(200), takeUntil(this._destroyed)).subscribe(() => {
      this.zoomLevelsChange.emit(this._getZooomLevels());
    });

    this._mapMovementDebouncer.pipe(debounceTime(200), takeUntil(this._destroyed)).subscribe(() => {
      this.mapCenterChange.emit(this._map.getCenter());
      this.mapBoundsChange.emit(this._map.getBounds().toArray());
    });

    merge(this._zoomLevelDebouncer, this._mapMovementDebouncer)
      .pipe(debounceTime(200), takeUntil(this._destroyed))
      .subscribe(() => this._emitViewportDimensionsChange());

    this._levelSwitchService.selectedLevel$
      .pipe(takeUntil(this._destroyed))
      .subscribe((level) => this.selectedLevelChange.emit(level));
    this._levelSwitchService.visibleLevels$
      .pipe(takeUntil(this._destroyed))
      .subscribe((levels) => this.visibleLevelsChange.emit(levels));
  }

  private _emitViewportDimensionsChange() {
    if (isSbbMapCenterOptions(this.viewportDimensions)) {
      this.viewportDimensionsChange.emit({
        mapCenter: this._map.getCenter(),
        zoomLevel: this._map.getZoom(),
      });
    } else if (isSbbBoundingBoxOptions(this.viewportDimensions)) {
      this.viewportDimensionsChange.emit({
        boundingBox: this._map.getBounds(),
      });
    }
  }

  private _onStyleLoaded(): void {
    if (this._isStyleLoaded) {
      return;
    }

    this._mapMarkerService.initStyleData(this._map);
    this._levelSwitchService.onInit(this._map);
    this._map.resize();
    // @ts-ignore
    this._mapService.verifySources(this._map, [
      SBB_ROKAS_ROUTE_SOURCE,
      ...this._mapMarkerService.sources,
    ]);

    this._map.on('zoomend', () => this._zoomLevelDebouncer.next());
    this._map.on('moveend', () => this._mapMovementDebouncer.next());
    // Emit initial values
    this._zoomLevelDebouncer.next();
    this._mapMovementDebouncer.next();
    this._show2Dor3D();

    if (this.styleOptions.railNetwork) {
      this._mapRailNetworkLayerService.updateOptions(this._map, this.styleOptions.railNetwork);
    }

    this._map.addControl(this._sbbGeolocateControl); // other controls are added in map-init-service.ts

    this._isStyleLoaded = true;
    this._styleLoaded.next();
    this.mapReady.next(this._map);
  }

  private _getZooomLevels(): SbbZoomLevels {
    return {
      minZoom: this._map.getMinZoom(),
      maxZoom: this._map.getMaxZoom(),
      currentZoom: this._map.getZoom(),
    };
  }

  private _validateInputParameter(): void {
    if (!this.apiKey) {
      throw new Error('Input parameter apiKey is mandatory');
    }
  }

  private _setupResizeObserver() {
    this._observer = new ResizeObserver(() => this._mapResized.next());
    this._observer.observe(this._mapElementRef.nativeElement);
  }

  private _getMarkers(): SbbMarker[] {
    const normalMarkers = this.markerOptions.markers ?? [];
    const routeMidpointMarkers =
      this._mapRoutesService.getRouteMarkers(
        this.journeyMapsRoutingOption?.routes,
        this.journeyMapsRoutingOption?.routesMetaInformations,
      ) ?? [];
    return [...normalMarkers, ...routeMidpointMarkers];
  }

  private _haveRoutesMetaInformationsChanged(changes: SimpleChanges): boolean {
    return (
      changes.journeyMapsRoutingOption?.currentValue?.routesMetaInformations?.length !==
        changes.journeyMapsRoutingOption?.previousValue?.routesMetaInformations?.length ||
      changes.journeyMapsRoutingOption?.currentValue?.routesMetaInformations !==
        changes.journeyMapsRoutingOption?.previousValue?.routesMetaInformations
    );
  }

  private _updateJourney() {
    this._mapJourneyService.updateJourney(
      this._map,
      this._featureEventListenerComponent.mapSelectionEventService,
      this.journeyMapsRoutingOption!.journey,
      this.journeyMapsRoutingOption!.journeyMetaInformation?.selectedLegId,
    );
    this._mapLeitPoiService.processData(this._map, this.journeyMapsRoutingOption!.journey, 0);
  }

  private _updateTransfer() {
    this._mapTransferService.updateTransfer(this._map, this.journeyMapsRoutingOption!.transfer);
    this._mapLeitPoiService.processData(this._map, this.journeyMapsRoutingOption!.transfer);
  }

  private _updateRoutes() {
    this._mapRoutesService.updateRoutes(
      this._map,
      this._featureEventListenerComponent.mapSelectionEventService,
      this.journeyMapsRoutingOption!.routes,
      this.journeyMapsRoutingOption!.routesMetaInformations,
    );
  }

  private _updateZones() {
    this._mapZoneService.updateZones(
      this._map,
      this._featureEventListenerComponent.mapSelectionEventService,
      this.journeyMapsZones,
    );
  }

  /**
   * If the level-switch feature is enabled by the client, then show only 3d layers (-lvl)
   * If the level-switch feature is disabled by the client, then show only 2d layers (-2d)
   */
  private _show2Dor3D() {
    const show3D = !!this.uiOptions.levelSwitch;
    this._setVisibility(this._map, '-2d', show3D ? 'none' : 'visible');
    this._setVisibility(this._map, '-lvl', show3D ? 'visible' : 'none');
  }

  private _setVisibility(map: MaplibreMap, layerIdSuffix: string, visibility: 'visible' | 'none') {
    map
      .getStyle()
      .layers?.filter((layer) => layer.id.endsWith(layerIdSuffix))
      .forEach((layer) => map.setLayoutProperty(layer.id, 'visibility', visibility));
  }
}

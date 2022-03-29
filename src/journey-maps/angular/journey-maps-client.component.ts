import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { LngLatBounds, LngLatLike, Map as MaplibreMap } from 'maplibre-gl';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, take, takeUntil } from 'rxjs/operators';

import { FeatureEventListenerComponent } from './components/feature-event-listener/feature-event-listener.component';
import { LevelSwitchService } from './components/level-switch/services/level-switch.service';
import { MapLayerFilterService } from './components/level-switch/services/map-layer-filter.service';
import {
  FeatureData,
  FeaturesClickEventData,
  FeaturesHoverChangeEventData,
  FeaturesSelectEventData,
  InteractionOptions,
  JourneyMapsRoutingOptions,
  ListenerOptions,
  MarkerOptions,
  StyleOptions,
  UIOptions,
  ViewportOptions,
  ZoomLevels,
} from './journey-maps-client.interfaces';
import { Marker } from './model/marker';
import { StyleMode } from './model/style-mode.enum';
import { bufferTimeOnValue } from './services/bufferTimeOnValue';
import { MARKER_BOUNDS_PADDING, ROUTE_SOURCE, WALK_SOURCE } from './services/constants';
import { LocaleService } from './services/locale.service';
import { MapConfigService } from './services/map/map-config.service';
import { MapInitService } from './services/map/map-init.service';
import { MapJourneyService } from './services/map/map-journey.service';
import { MapLeitPoiService } from './services/map/map-leit-poi.service';
import { MapMarkerService } from './services/map/map-marker.service';
import { MapRoutesService } from './services/map/map-routes.service';
import { MapTransferService } from './services/map/map-transfer.service';
import { MapZoneService } from './services/map/map-zone.service';
import { Direction, MapService } from './services/map/map.service';

const SATELLITE_MAP_MAX_ZOOM = 19.2;
const SATELLITE_MAP_TILE_SIZE = 256;
const SATELLITE_MAP_URL_TEMPLATE =
  'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg';

/**
 * This component uses the Maplibre GL JS api to render a map and display the given data on the map.
 * <example-url>/</example-url>
 */
@Component({
  selector: 'sbb-journey-maps',
  templateUrl: './journey-maps-client.component.html',
  styleUrls: ['./journey-maps-client.component.css'],
  providers: [LevelSwitchService, MapLayerFilterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyMapsClientComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private _map: MaplibreMap;
  @ViewChild('map') private _mapElementRef: ElementRef;

  @ViewChild(FeatureEventListenerComponent)
  private _featureEventListenerComponent: FeatureEventListenerComponent;

  /** Your personal API key. Ask <a href="mailto:dlrokas@sbb.ch">dlrokas@sbb.ch</a> if you need one. */
  @Input() apiKey: string;

  // **************************************** LANGUAGE *****************************************/

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

  // **************************************** STYLE OPTIONS *****************************************/

  private _defaultStyleOptions: StyleOptions = {
    url: 'https://journey-maps-tiles.geocdn.sbb.ch/styles/{styleId}/style.json?api_key={apiKey}',
    brightId: 'base_bright_v2_ki',
    darkId: 'base_dark_v2_ki',
    mode: 'BRIGHT',
  };

  /**
   * Settings to control the map (bright and dark) styles
   */
  @Input()
  get styleOptions(): StyleOptions {
    return this._styleOptions;
  }

  set styleOptions(styleOptions: StyleOptions) {
    this._styleOptions = {
      ...this._defaultStyleOptions,
      ...styleOptions,
    };
  }

  private _styleOptions: StyleOptions = this._defaultStyleOptions;

  // **************************************** CONTROL OPTIONS *****************************************/

  private _defaultInteractionOptions: InteractionOptions = {
    /** Mobile-friendly default: you get a message-overlay if you try to pan with one finger. */
    oneFingerPan: false,
    scrollZoom: true,
  };

  /**
   * Settings to control the movement of the map by means other than via the buttons on the _map
   */
  @Input()
  get interactionOptions(): InteractionOptions {
    return this._interactionOptions;
  }

  set interactionOptions(interactionOptions: InteractionOptions) {
    this._interactionOptions = {
      ...this._defaultInteractionOptions,
      ...interactionOptions,
    };
  }

  private _interactionOptions: InteractionOptions = this._defaultInteractionOptions;

  // **************************************** UI OPTIONS *****************************************/

  private _defaultUIOptions: UIOptions = {
    showSmallButtons: false,
    levelSwitch: true,
    zoomControls: true,
    basemapSwitch: true,
    homeButton: false,
  };

  /**
   * Settings to control which control buttons are shown on the _map
   */
  @Input()
  get uiOptions(): UIOptions {
    return this._uiOptions;
  }

  set uiOptions(uiOptions: UIOptions) {
    this._uiOptions = {
      ...this._defaultUIOptions,
      ...uiOptions,
    };
  }

  private _uiOptions: UIOptions = this._defaultUIOptions;

  // **************************************** VIEWPORT OPTIONS *****************************************/

  private readonly _homeButtonBoundingBoxPadding = 0;

  private _defaultViewportOptions: ViewportOptions = {
    boundingBoxPadding: this._homeButtonBoundingBoxPadding,
  };

  /**
   * Settings that control what portion of the map is shown initially
   */
  @Input()
  get viewportOptions(): ViewportOptions {
    return this._viewportOptions;
  }

  set viewportOptions(viewportOptions: ViewportOptions) {
    this._viewportOptions = {
      ...this._defaultViewportOptions,
      ...viewportOptions,
    };
  }

  private _viewportOptions: ViewportOptions = this._defaultViewportOptions;

  /* **************************************** JOURNEY-MAPS ROUTING OPTIONS *****************************************/

  /**
   * Input to display JourneyMaps GeoJson routing data on the map.
   *
   * **WARNING:** The map currently doesn't support more than one of these fields to be set at a time
   */
  @Input() journeyMapsRoutingOption: JourneyMapsRoutingOptions;

  /* **************************************** JOURNEY-MAPS ZONES *****************************************/

  /**
   * Input to display JourneyMaps GeoJson zone data on the map.
   */
  @Input() journeyMapsZones: GeoJSON.FeatureCollection;

  /* **************************************** MARKER OPTIONS *****************************************/

  private _defaultMarkerOptions: MarkerOptions = {
    popup: false,
  };

  /**
   * Settings to control interacting with markers on the _map
   */
  @Input()
  get markerOptions(): MarkerOptions {
    return this._markerOptions;
  }

  set markerOptions(markerOptions: MarkerOptions) {
    this._markerOptions = {
      ...this._defaultMarkerOptions,
      ...markerOptions,
    };
  }

  private _markerOptions: MarkerOptions = this._defaultMarkerOptions;

  /**
   * Custom <code>ng-template</code> for the marker details. (Popup or Teaser)
   * See examples for details.
   *
   * <b>NOTE:</b> This does not work - at the moment - when using the Web Component version of the library.
   */
  @Input() markerDetailsTemplate?: TemplateRef<any>;

  // **************************************** 2 WAY-BINDING (INPUTS) *****************************************/

  /**
   * Select one of the markers contained in {@link JourneyMapsClientComponent#markers}
   *
   * Allowed values are either the ID of a marker to select or <code>undefined</code> to unselect.
   */
  @Input()
  get selectedMarkerId(): string | undefined {
    // without this getter, the setter is never called when passing 'undefined' (via the 'elements' web component)
    return this.selectedMarker?.id;
  }

  set selectedMarkerId(markerId: string | undefined) {
    if (!!markerId) {
      const selectedMarker = this.markerOptions.markers?.find((marker) => marker.id === markerId);
      this.onMarkerSelected(selectedMarker!);
    } else if (!!this.selectedMarker) {
      this.onMarkerUnselected();
    }
  }

  /** Which (floor-)level should be shown */
  @Input() selectedLevel: number;

  @Input() listenerOptions: ListenerOptions;

  // **************************************** 2 WAY-BINDING (OUTPUTS) *****************************************

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
  @Output() selectedFeaturesChange: EventEmitter<FeaturesSelectEventData> =
    new EventEmitter<FeaturesSelectEventData>();

  // **************************************** OTHER OUTPUTS *****************************************

  /**
   * This event is emitted whenever map features were clicked.
   */
  @Output() featuresClick: EventEmitter<FeaturesClickEventData> =
    new EventEmitter<FeaturesClickEventData>();

  /**
   * This event is emitted whenever mouse hovered or leaved map features.
   */
  @Output() featuresHoverChange: EventEmitter<FeaturesHoverChangeEventData> =
    new EventEmitter<FeaturesHoverChangeEventData>();

  /**
   * This event is emitted whenever the list of available (floor-) levels changes
   */
  @Output() visibleLevelsChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  /**
   * This event is emitted whenever one of the {@link ZoomLevels} of the map has changed.
   */
  @Output() zoomLevelsChange: EventEmitter<ZoomLevels> = new EventEmitter<ZoomLevels>();
  /**
   * This event is emitted whenever the center of the map has changed. (Whenever the map has been moved)
   */
  @Output() mapCenterChange: EventEmitter<LngLatLike> = new EventEmitter<LngLatLike>();
  /**
   * This event is emitted whenever the map is ready.
   */
  @Output() mapReady: ReplaySubject<MaplibreMap> = new ReplaySubject<MaplibreMap>(1);

  private _currentZoomLevelDebouncer = new Subject<void>();
  private _mapCenterChangeDebouncer = new Subject<void>();
  private _windowResized = new Subject<void>();
  private _destroyed = new Subject<void>();
  private _styleLoaded = new ReplaySubject<void>(1);
  private _viewportOptionsChanged = new Subject<void>();
  private _mapStyleModeChanged = new Subject<void>();

  // visible for testing
  touchEventCollector: Subject<TouchEvent> = new Subject<TouchEvent>();
  touchOverlayText: string;
  touchOverlayStyleClass: string = '';

  // _map._isStyleLoaded() returns sometimes false when sources are being updated.
  // Therefore we set this variable to true once the style has been loaded.
  private _isStyleLoaded = false;

  private _selectedMarker: Marker | undefined;

  private _isSatelliteMap = false;
  private _satelliteLayerId = 'esriWorldImageryLayer';
  private _satelliteImageSourceName = 'esriWorldImagerySource';

  constructor(
    private _mapInitService: MapInitService,
    private _mapConfigService: MapConfigService,
    private _mapService: MapService,
    private _mapMarkerService: MapMarkerService,
    private _mapJourneyService: MapJourneyService,
    private _mapTransferService: MapTransferService,
    private _mapRoutesService: MapRoutesService,
    private _mapZoneService: MapZoneService,
    private _mapLeitPoiService: MapLeitPoiService,
    private _levelSwitchService: LevelSwitchService,
    private _mapLayerFilterService: MapLayerFilterService,
    private _cd: ChangeDetectorRef,
    private _i18n: LocaleService,
    private _host: ElementRef
  ) {
    // binding of 'this' is needed for elements/webcomponent
    // https://github.com/angular/angular/issues/22114#issuecomment-569311422
    this._host.nativeElement.moveNorth = this.moveNorth.bind(this);
    this._host.nativeElement.moveEast = this.moveEast.bind(this);
    this._host.nativeElement.moveSouth = this.moveSouth.bind(this);
    this._host.nativeElement.moveWest = this.moveWest.bind(this);
    this._host.nativeElement.zoomIn = this.zoomIn.bind(this);
    this._host.nativeElement.zoomOut = this.zoomOut.bind(this);
  }

  onTouchStart(event: TouchEvent): void {
    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    if (!this.interactionOptions.oneFingerPan) {
      this._map.dragPan.disable();
    }
    this.touchEventCollector.next(event);
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchOverlayStyleClass = '';
    this.touchEventCollector.next(event);
  }

  set selectedMarker(value: Marker | undefined) {
    if (value && (value.triggerEvent || value.triggerEvent === undefined)) {
      this.selectedMarkerIdChange.emit(value.id);
    } else {
      this.selectedMarkerIdChange.emit(undefined);
    }
    if (value && value.markerUrl) {
      open(value.markerUrl, '_self'); // Do we need to make target configurable ?
    } else {
      this._selectedMarker = value;
    }
  }

  get selectedMarker(): Marker | undefined {
    return this._selectedMarker;
  }

  /**
   * Move the map North as if pressing the up arrow key on the keyboard
   */
  moveNorth(): void {
    this._mapService.pan(this._map, 'NORTH');
  }

  /**
   * Move the map East as if pressing the right arrow key on the keyboard
   */
  moveEast(): void {
    this._mapService.pan(this._map, 'EAST');
  }

  /**
   * Move the map South as if pressing the down arrow key on the keyboard
   */
  moveSouth(): void {
    this._mapService.pan(this._map, 'SOUTH');
  }

  /**
   * Move the map West as if pressing the left arrow key on the keyboard
   */
  moveWest(): void {
    this._mapService.pan(this._map, 'WEST');
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

  private _updateMarkers(): void {
    this.selectedMarker = this.markerOptions.markers?.find(
      (marker) => this.selectedMarkerId === marker.id
    );
    this._executeWhenMapStyleLoaded(() => {
      this._mapMarkerService.updateMarkers(
        this._map,
        this.markerOptions.markers,
        this.selectedMarker,
        this.styleOptions.mode
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

  get getMarkersBounds(): LngLatBounds | undefined {
    return this.markerOptions.zoomToMarkers
      ? this.computeMarkersBounds(this.markerOptions.markers)
      : undefined;
  }

  ngOnInit(): void {
    this._validateInputParameter();
    this._setupSubjects();
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
        if (changes.journeyMapsRoutingOption?.currentValue?.journey) {
          this._mapJourneyService.updateJourney(
            this._map,
            mapSelectionEventService,
            this.journeyMapsRoutingOption.journey
          );
        }
        if (changes.journeyMapsRoutingOption?.currentValue?.transfer) {
          this._mapTransferService.updateTransfer(
            this._map,
            this.journeyMapsRoutingOption.transfer
          );
          this._mapLeitPoiService.processData(this._map, this.journeyMapsRoutingOption.transfer);
        }
        if (changes.journeyMapsRoutingOption?.currentValue?.routes) {
          this._mapRoutesService.updateRoutes(
            this._map,
            mapSelectionEventService,
            this.journeyMapsRoutingOption.routes
          );
        }
      });
    }

    if (changes.journeyMapsZones?.currentValue || changes.journeyMapsZones?.previousValue) {
      this._executeWhenMapStyleLoaded(() => {
        this._mapZoneService.updateZones(
          this._map,
          this._featureEventListenerComponent.mapSelectionEventService,
          this.journeyMapsZones
        );
      });
    }

    if (Object.values(this.journeyMapsRoutingOption ?? {}).filter((val) => val).length > 1) {
      console.error(
        'journeyMapsRoutingOption: Use either transfer or journey or routes. It does not work correctly when more than one of these properties is set.'
      );
    }

    if (!this._isStyleLoaded) {
      return;
    }

    if (changes.viewportOptions) {
      this._viewportOptionsChanged.next();
    }

    if (changes.styleOptions?.currentValue.mode !== changes.styleOptions?.previousValue?.mode) {
      this._mapStyleModeChanged.next();
    }

    if (changes.selectedLevel?.currentValue !== undefined) {
      this._levelSwitchService.switchLevel(this.selectedLevel);
    }
  }

  ngAfterViewInit(): void {
    // CHECKME ses: Lazy initialization with IntersectionObserver?
    const styleUrl = this._getStyleUrl();

    this.touchOverlayText = this._i18n.getText('touchOverlay.tip');
    this._mapInitService
      .initializeMap(
        this._mapElementRef.nativeElement,
        this._i18n.language,
        styleUrl,
        this.interactionOptions.scrollZoom!,
        this.viewportOptions.zoomLevel,
        this.viewportOptions.mapCenter,
        this.viewportOptions.boundingBox ?? this.getMarkersBounds,
        this.viewportOptions.boundingBox
          ? this.viewportOptions.boundingBoxPadding
          : MARKER_BOUNDS_PADDING,
        this.interactionOptions.oneFingerPan
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
      .pipe(bufferTimeOnValue(200), takeUntil(this._destroyed))
      .subscribe((touchEvents) => {
        const containsTwoFingerTouch = touchEvents.some(
          (touchEvent) => touchEvent.touches.length === 2
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
  }

  private _getStyleUrl(): string {
    return this.styleOptions
      .url!.replace('{styleId}', this._getStyleId()!)
      .replace('{apiKey}', this.apiKey);
  }

  private _getStyleId(): string | undefined {
    return this.styleOptions.mode === 'DARK'
      ? this.styleOptions.darkId
      : this.styleOptions.brightId;
  }

  ngOnDestroy(): void {
    this._map?.remove();

    this._destroyed.next();
    this._destroyed.complete();
    this._mapLeitPoiService.destroy();
    this._levelSwitchService.destroy();
  }

  private _setupSubjects(): void {
    this._windowResized
      .pipe(debounceTime(500), takeUntil(this._destroyed))
      .subscribe(() => this._map.resize());

    this._viewportOptionsChanged
      .pipe(debounceTime(200), takeUntil(this._destroyed))
      .subscribe(() =>
        this._mapService.moveMap(
          this._map,
          this.viewportOptions.boundingBox ?? this.getMarkersBounds,
          this.viewportOptions.boundingBox
            ? this.viewportOptions.boundingBoxPadding
            : MARKER_BOUNDS_PADDING,
          this.viewportOptions.zoomLevel,
          this.viewportOptions.mapCenter
        )
      );

    this._mapStyleModeChanged
      .pipe(
        debounceTime(200),
        switchMap(() => this._mapInitService.fetchStyle(this._getStyleUrl())),
        takeUntil(this._destroyed)
      )
      .subscribe((style) => {
        this._map.setStyle(style, { diff: false });
        this._map.once('styledata', () => {
          this._mapMarkerService.updateMarkers(
            this._map,
            this.markerOptions.markers,
            this.selectedMarker,
            this.styleOptions.mode
          );
          this._mapLayerFilterService.collectLvlLayers();
          this._levelSwitchService.switchLevel(this._levelSwitchService.selectedLevel);
        });
      });

    this._currentZoomLevelDebouncer
      .pipe(debounceTime(200), takeUntil(this._destroyed))
      .subscribe(() => this.zoomLevelsChange.emit(this._getZooomLevels()));

    this._mapCenterChangeDebouncer
      .pipe(debounceTime(200), takeUntil(this._destroyed))
      .subscribe(() => this.mapCenterChange.emit(this._map.getCenter()));

    this._levelSwitchService.selectedLevel$
      .pipe(takeUntil(this._destroyed))
      .subscribe((level) => this.selectedLevelChange.emit(level));
    this._levelSwitchService.visibleLevels$
      .pipe(takeUntil(this._destroyed))
      .subscribe((levels) => this.visibleLevelsChange.emit(levels));
  }

  @HostListener('window:resize')
  onResize(): void {
    this._windowResized.next();
  }

  onResized(): void {
    if (this._map) {
      this._map.resize();
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
      ROUTE_SOURCE,
      WALK_SOURCE,
      ...this._mapMarkerService.sources,
    ]);
    this._addSatelliteSource(this._map);

    this._map.on('zoomend', () => this._currentZoomLevelDebouncer.next());
    this._map.on('moveend', () => this._mapCenterChangeDebouncer.next());
    // Emit initial values
    this._currentZoomLevelDebouncer.next();
    this._mapCenterChangeDebouncer.next();

    this._isStyleLoaded = true;
    this._styleLoaded.next();
    this.mapReady.next(this._map);
  }

  private _addSatelliteSource(map: maplibregl.Map) {
    map.addSource(this._satelliteImageSourceName, {
      type: 'raster',
      tiles: [SATELLITE_MAP_URL_TEMPLATE],
      tileSize: SATELLITE_MAP_TILE_SIZE,
    });
  }

  /** @docs-private */
  // When a marker has been unselected from outside the map.
  onMarkerUnselected(): void {
    this.selectedMarker = undefined;
    this._mapMarkerService.unselectFeature(this._map);
    this._cd.detectChanges();
  }

  private _getZooomLevels(): ZoomLevels {
    return {
      minZoom: MapInitService.minZoom,
      maxZoom: MapInitService.maxZoom,
      currentZoom: this._map.getZoom(),
    };
  }

  private _validateInputParameter(): void {
    if (!this.apiKey) {
      throw new Error('Input parameter apiKey is mandatory');
    }
  }

  /** @docs-private */
  // When a marker has been selected from outside the map.
  onMarkerSelected(marker: Marker): void {
    if (marker?.id !== this.selectedMarkerId) {
      this.selectedMarker = marker;
      this._mapMarkerService.selectMarker(this._map, marker);
      this._cd.detectChanges();
    }
  }

  /** @docs-private */
  computeMarkersBounds(markers: Marker[] | undefined): LngLatBounds {
    const bounds = new LngLatBounds();
    markers?.forEach((marker: Marker) => {
      bounds.extend(marker.position as LngLatLike);
    });
    return bounds;
  }

  onToggleBasemap() {
    this._isSatelliteMap = !this._isSatelliteMap;
    if (this._isSatelliteMap) {
      this._map.addLayer(
        {
          id: this._satelliteLayerId,
          type: 'raster',
          source: this._satelliteImageSourceName,
          maxzoom: SATELLITE_MAP_MAX_ZOOM,
        },
        'waterName_point_other'
      );
    } else {
      this._map.removeLayer(this._satelliteLayerId);
    }
  }

  handleMarkerOrClusterClick(features: FeatureData[]) {
    const featureEventDataList = features.filter((feature) =>
      this._mapMarkerService.allMarkerAndClusterLayers.includes(feature.layer.id)
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
        this.selectedMarkerId
      );
      this.selectedMarker = this.markerOptions.markers?.find(
        (marker) => marker.id === selectedMarkerId && !!selectedMarkerId
      );
      this._cd.detectChanges();
    }
  }

  onHomeButtonClicked() {
    this._mapService.moveMap(
      this._map,
      this._mapInitService.getDefaultBoundingBox(),
      this._homeButtonBoundingBoxPadding
    );
  }
}

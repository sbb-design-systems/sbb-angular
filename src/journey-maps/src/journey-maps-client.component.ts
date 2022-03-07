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
import { MapInitService } from './services/map/map-init.service';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, take, takeUntil } from 'rxjs/operators';
import { MapMarkerService } from './services/map/map-marker.service';
import { Constants } from './services/constants';
import { Marker } from './model/marker';
import { LocaleService } from './services/locale.service';
import { bufferTimeOnValue } from './services/bufferTimeOnValue';
import { Direction, MapService } from './services/map/map.service';
import { MapJourneyService } from './services/map/map-journey.service';
import { MapTransferService } from './services/map/map-transfer.service';
import { MapRoutesService } from './services/map/map-routes.service';
import { MapZoneService } from './services/map/map-zone.service';
import { MapConfigService } from './services/map/map-config.service';
import { MapLeitPoiService } from './services/map/map-leit-poi.service';
import { StyleMode } from './model/style-mode.enum';
import { LevelSwitchService } from './components/level-switch/services/level-switch.service';
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
import { MapLayerFilterService } from './components/level-switch/services/map-layer-filter.service';
import { FeatureEventListenerComponent } from './components/feature-event-listener/feature-event-listener.component';

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
  styleUrls: ['./journey-maps-client.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyMapsClientComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private map: MaplibreMap;
  @ViewChild('map') private mapElementRef: ElementRef;

  @ViewChild(FeatureEventListenerComponent)
  private featureEventListenerComponent: FeatureEventListenerComponent;

  /** Your personal API key. Ask <a href="mailto:dlrokas@sbb.ch">dlrokas@sbb.ch</a> if you need one. */
  @Input() apiKey: string;

  // **************************************** LANGUAGE *****************************************/

  /**
   * The language used for localized labels.
   * Allowed values are <code>de</code>, <code>fr</code>, <code>it</code>, <code>en</code>.
   */
  @Input()
  get language(): string {
    return this.i18n.language;
  }

  set language(language: string) {
    if (language == null) {
      throw new TypeError("language mustn't be null");
    }

    language = language.toLowerCase();
    if (language === 'de' || language === 'fr' || language === 'it' || language === 'en') {
      this.i18n.language = language;
    } else {
      throw new TypeError('Illegal value for language. Allowed values are de|fr|it|en.');
    }
  }

  // **************************************** STYLE OPTIONS *****************************************/

  private defaultStyleOptions: StyleOptions = {
    url: 'https://journey-maps-tiles.geocdn.sbb.ch/styles/{styleId}/style.json?api_key={apiKey}',
    brightId: 'base_bright_v2_ki',
    darkId: 'base_dark_v2_ki',
    mode: StyleMode.BRIGHT,
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
      ...this.defaultStyleOptions,
      ...styleOptions,
    };
  }

  private _styleOptions: StyleOptions = this.defaultStyleOptions;

  // **************************************** CONTROL OPTIONS *****************************************/

  private defaultInteractionOptions: InteractionOptions = {
    /** Mobile-friendly default: you get a message-overlay if you try to pan with one finger. */
    oneFingerPan: false,
    scrollZoom: true,
  };

  /**
   * Settings to control the movement of the map by means other than via the buttons on the map
   */
  @Input()
  get interactionOptions(): InteractionOptions {
    return this._interactionOptions;
  }

  set interactionOptions(interactionOptions: InteractionOptions) {
    this._interactionOptions = {
      ...this.defaultInteractionOptions,
      ...interactionOptions,
    };
  }

  private _interactionOptions: InteractionOptions = this.defaultInteractionOptions;

  // **************************************** UI OPTIONS *****************************************/

  private defaultUIOptions: UIOptions = {
    showSmallButtons: false,
    levelSwitch: true,
    zoomControls: true,
    basemapSwitch: true,
    homeButton: false,
  };

  /**
   * Settings to control which control buttons are shown on the map
   */
  @Input()
  get uiOptions(): UIOptions {
    return this._uiOptions;
  }

  set uiOptions(uiOptions: UIOptions) {
    this._uiOptions = {
      ...this.defaultUIOptions,
      ...uiOptions,
    };
  }

  private _uiOptions: UIOptions = this.defaultUIOptions;

  // **************************************** VIEWPORT OPTIONS *****************************************/

  private readonly homeButtonBoundingBoxPadding = 0;

  private defaultViewportOptions: ViewportOptions = {
    boundingBoxPadding: this.homeButtonBoundingBoxPadding,
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
      ...this.defaultViewportOptions,
      ...viewportOptions,
    };
  }

  private _viewportOptions: ViewportOptions = this.defaultViewportOptions;

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

  private defaultMarkerOptions: MarkerOptions = {
    popup: false,
  };

  /**
   * Settings to control interacting with markers on the map
   */
  @Input()
  get markerOptions(): MarkerOptions {
    return this._markerOptions;
  }

  set markerOptions(markerOptions: MarkerOptions) {
    this._markerOptions = {
      ...this.defaultMarkerOptions,
      ...markerOptions,
    };
  }

  private _markerOptions: MarkerOptions = this.defaultMarkerOptions;

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
  get selectedMarkerId(): string {
    // without this getter, the setter is never called when passing 'undefined' (via the 'elements' web component)
    return this.selectedMarker?.id;
  }

  set selectedMarkerId(markerId: string | undefined) {
    if (!!markerId) {
      const selectedMarker = this.markerOptions.markers?.find((marker) => marker.id === markerId);
      this.onMarkerSelected(selectedMarker);
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
  @Output() selectedMarkerIdChange = new EventEmitter<string>();
  /**
   * This event is emitted whenever the selected (floor-) level changes.
   */
  @Output() selectedLevelChange = new EventEmitter<number>();
  /**
   * This event is emitted whenever the selected features changes.
   */
  @Output() selectedFeaturesChange = new EventEmitter<FeaturesSelectEventData>();

  // **************************************** OTHER OUTPUTS *****************************************

  /**
   * This event is emitted whenever map features were clicked.
   */
  @Output() featuresClick = new EventEmitter<FeaturesClickEventData>();

  /**
   * This event is emitted whenever mouse hovered or leaved map features.
   */
  @Output() featuresHoverChange = new EventEmitter<FeaturesHoverChangeEventData>();

  /**
   * This event is emitted whenever the list of available (floor-) levels changes
   */
  @Output() visibleLevelsChange = new EventEmitter<number[]>();
  /**
   * This event is emitted whenever one of the {@link ZoomLevels} of the map has changed.
   */
  @Output() zoomLevelsChange = new EventEmitter<ZoomLevels>();
  /**
   * This event is emitted whenever the center of the map has changed. (Whenever the map has been moved)
   */
  @Output() mapCenterChange = new EventEmitter<LngLatLike>();
  /**
   * This event is emitted whenever the map is ready.
   */
  @Output() mapReady = new ReplaySubject<MaplibreMap>(1);

  private currentZoomLevelDebouncer = new Subject<void>();
  private mapCenterChangeDebouncer = new Subject<void>();
  private windowResized = new Subject<void>();
  private destroyed = new Subject<void>();
  private styleLoaded = new ReplaySubject<void>(1);
  private viewportOptionsChanged = new Subject<void>();
  private mapStyleModeChanged = new Subject<void>();

  // visible for testing
  touchEventCollector = new Subject<TouchEvent>();
  public touchOverlayText: string;
  public touchOverlayStyleClass = '';

  // map.isStyleLoaded() returns sometimes false when sources are being updated.
  // Therefore we set this variable to true once the style has been loaded.
  private isStyleLoaded = false;

  private _selectedMarker: Marker;

  private isSatelliteMap = false;
  private satelliteLayerId = 'esriWorldImageryLayer';
  private satelliteImageSourceName = 'esriWorldImagerySource';

  /** @internal */
  constructor(
    private mapInitService: MapInitService,
    private mapConfigService: MapConfigService,
    private mapService: MapService,
    private mapMarkerService: MapMarkerService,
    private mapJourneyService: MapJourneyService,
    private mapTransferService: MapTransferService,
    private mapRoutesService: MapRoutesService,
    private mapZoneService: MapZoneService,
    private mapLeitPoiService: MapLeitPoiService,
    private levelSwitchService: LevelSwitchService,
    private mapLayerFilterService: MapLayerFilterService,
    private cd: ChangeDetectorRef,
    private i18n: LocaleService,
    private host: ElementRef
  ) {
    // binding of 'this' is needed for elements/webcomponent
    // https://github.com/angular/angular/issues/22114#issuecomment-569311422
    this.host.nativeElement.moveNorth = this.moveNorth.bind(this);
    this.host.nativeElement.moveEast = this.moveEast.bind(this);
    this.host.nativeElement.moveSouth = this.moveSouth.bind(this);
    this.host.nativeElement.moveWest = this.moveWest.bind(this);
    this.host.nativeElement.zoomIn = this.zoomIn.bind(this);
    this.host.nativeElement.zoomOut = this.zoomOut.bind(this);
  }

  onTouchStart(event: TouchEvent): void {
    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    if (!this.interactionOptions.oneFingerPan) {
      this.map.dragPan.disable();
    }
    this.touchEventCollector.next(event);
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchOverlayStyleClass = '';
    this.touchEventCollector.next(event);
  }

  public set selectedMarker(value: Marker) {
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

  public get selectedMarker(): Marker {
    return this._selectedMarker;
  }

  /**
   * Move the map North as if pressing the up arrow key on the keyboard
   */
  public moveNorth(): void {
    this.mapService.pan(this.map, Direction.NORTH);
  }

  /**
   * Move the map East as if pressing the right arrow key on the keyboard
   */
  public moveEast(): void {
    this.mapService.pan(this.map, Direction.EAST);
  }

  /**
   * Move the map South as if pressing the down arrow key on the keyboard
   */
  public moveSouth(): void {
    this.mapService.pan(this.map, Direction.SOUTH);
  }

  /**
   * Move the map West as if pressing the left arrow key on the keyboard
   */
  public moveWest(): void {
    this.mapService.pan(this.map, Direction.WEST);
  }

  /**
   * Zoom In
   */
  public zoomIn(): void {
    this.map?.zoomIn();
  }

  /**
   * Zoom Out
   */
  public zoomOut(): void {
    this.map?.zoomOut();
  }

  private updateMarkers(): void {
    this.selectedMarker = this.markerOptions.markers?.find(
      (marker) => this.selectedMarkerId === marker.id
    );
    this.executeWhenMapStyleLoaded(() => {
      this.mapMarkerService.updateMarkers(
        this.map,
        this.markerOptions.markers,
        this.selectedMarker,
        this.styleOptions.mode
      );
      this.cd.detectChanges();
    });
  }

  private executeWhenMapStyleLoaded(callback: () => void): void {
    if (this.isStyleLoaded) {
      callback();
    } else {
      this.styleLoaded.pipe(take(1), delay(500)).subscribe(() => callback());
    }
  }

  get getMarkersBounds(): LngLatBounds {
    return this.markerOptions.zoomToMarkers
      ? this.computeMarkersBounds(this.markerOptions.markers)
      : undefined;
  }

  ngOnInit(): void {
    this.validateInputParameter();
    this.setupSubjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mapConfigService.updateConfigs(this.markerOptions.popup);

    if (
      changes.markerOptions?.currentValue.markers !== changes.markerOptions?.previousValue?.markers
    ) {
      this.updateMarkers();
    }

    // handle journey, transfer, and routes together, otherwise they can overwrite each other's transfer or route data
    if (changes.journeyMapsRoutingOption) {
      this.executeWhenMapStyleLoaded(() => {
        // stam: is there other way to achieve this ?
        const mapSelectionEventService =
          this.featureEventListenerComponent.mapSelectionEventService;

        // remove previous data from map
        this.mapJourneyService.updateJourney(this.map, mapSelectionEventService, undefined);
        this.mapTransferService.updateTransfer(this.map, undefined);
        this.mapRoutesService.updateRoutes(this.map, mapSelectionEventService, undefined);
        this.mapLeitPoiService.processData(this.map, undefined);
        // only add new data if we have some
        if (changes.journeyMapsRoutingOption?.currentValue?.journey) {
          this.mapJourneyService.updateJourney(
            this.map,
            mapSelectionEventService,
            this.journeyMapsRoutingOption.journey
          );
        }
        if (changes.journeyMapsRoutingOption?.currentValue?.transfer) {
          this.mapTransferService.updateTransfer(this.map, this.journeyMapsRoutingOption.transfer);
          this.mapLeitPoiService.processData(this.map, this.journeyMapsRoutingOption.transfer);
        }
        if (changes.journeyMapsRoutingOption?.currentValue?.routes) {
          this.mapRoutesService.updateRoutes(
            this.map,
            mapSelectionEventService,
            this.journeyMapsRoutingOption.routes
          );
        }
      });
    }

    if (changes.journeyMapsZones?.currentValue || changes.journeyMapsZones?.previousValue) {
      this.executeWhenMapStyleLoaded(() => {
        this.mapZoneService.updateZones(
          this.map,
          this.featureEventListenerComponent.mapSelectionEventService,
          this.journeyMapsZones
        );
      });
    }

    if (Object.values(this.journeyMapsRoutingOption ?? {}).filter((val) => val).length > 1) {
      console.error(
        'journeyMapsRoutingOption: Use either transfer or journey or routes. It does not work correctly when more than one of these properties is set.'
      );
    }

    if (!this.isStyleLoaded) {
      return;
    }

    if (changes.viewportOptions) {
      this.viewportOptionsChanged.next();
    }

    if (changes.styleOptions?.currentValue.mode !== changes.styleOptions?.previousValue?.mode) {
      this.mapStyleModeChanged.next();
    }

    if (changes.selectedLevel?.currentValue !== undefined) {
      this.levelSwitchService.switchLevel(this.selectedLevel);
    }
  }

  ngAfterViewInit(): void {
    // CHECKME ses: Lazy initialization with IntersectionObserver?
    const styleUrl = this.getStyleUrl();

    this.touchOverlayText = this.i18n.getText('touchOverlay.tip');
    this.mapInitService
      .initializeMap(
        this.mapElementRef.nativeElement,
        this.i18n.language,
        styleUrl,
        this.interactionOptions.scrollZoom,
        this.viewportOptions.zoomLevel,
        this.viewportOptions.mapCenter,
        this.viewportOptions.boundingBox ?? this.getMarkersBounds,
        this.viewportOptions.boundingBox
          ? this.viewportOptions.boundingBoxPadding
          : Constants.MARKER_BOUNDS_PADDING,
        this.interactionOptions.oneFingerPan
      )
      .subscribe((m) => {
        this.map = m;
        if (this.map.isStyleLoaded()) {
          this.onStyleLoaded();
        } else {
          this.map.on('styledata', () => {
            this.onStyleLoaded();
          });
        }
      });

    this.touchEventCollector
      .pipe(bufferTimeOnValue(200), takeUntil(this.destroyed))
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
          this.cd.detectChanges();
        }
      });
  }

  private getStyleUrl(): string {
    return this.styleOptions.url
      .replace('{styleId}', this.getStyleId())
      .replace('{apiKey}', this.apiKey);
  }

  private getStyleId(): string {
    return this.styleOptions.mode === StyleMode.DARK
      ? this.styleOptions.darkId
      : this.styleOptions.brightId;
  }

  ngOnDestroy(): void {
    this.map?.remove();

    this.destroyed.next();
    this.destroyed.complete();
    this.mapLeitPoiService.destroy();
  }

  private setupSubjects(): void {
    this.windowResized
      .pipe(debounceTime(500), takeUntil(this.destroyed))
      .subscribe(() => this.map.resize());

    this.viewportOptionsChanged
      .pipe(debounceTime(200), takeUntil(this.destroyed))
      .subscribe(() =>
        this.mapService.moveMap(
          this.map,
          this.viewportOptions.boundingBox ?? this.getMarkersBounds,
          this.viewportOptions.boundingBox
            ? this.viewportOptions.boundingBoxPadding
            : Constants.MARKER_BOUNDS_PADDING,
          this.viewportOptions.zoomLevel,
          this.viewportOptions.mapCenter
        )
      );

    this.mapStyleModeChanged
      .pipe(
        debounceTime(200),
        switchMap(() => this.mapInitService.fetchStyle(this.getStyleUrl())),
        takeUntil(this.destroyed)
      )
      .subscribe((style) => {
        this.map.setStyle(style, { diff: false });
        this.map.once('styledata', () => {
          this.mapMarkerService.updateMarkers(
            this.map,
            this.markerOptions.markers,
            this.selectedMarker,
            this.styleOptions.mode
          );
          this.mapLayerFilterService.collectLvlLayers();
          this.levelSwitchService.switchLevel(this.levelSwitchService.selectedLevel);
        });
      });

    this.currentZoomLevelDebouncer
      .pipe(debounceTime(200), takeUntil(this.destroyed))
      .subscribe(() => this.zoomLevelsChange.emit(this.getZooomLevels()));

    this.mapCenterChangeDebouncer
      .pipe(debounceTime(200), takeUntil(this.destroyed))
      .subscribe(() => this.mapCenterChange.emit(this.map.getCenter()));

    this.levelSwitchService.selectedLevel$
      .pipe(takeUntil(this.destroyed))
      .subscribe((level) => this.selectedLevelChange.emit(level));
    this.levelSwitchService.visibleLevels$
      .pipe(takeUntil(this.destroyed))
      .subscribe((levels) => this.visibleLevelsChange.emit(levels));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowResized.next();
  }

  onResized(): void {
    if (this.map) {
      this.map.resize();
    }
  }

  private onStyleLoaded(): void {
    if (this.isStyleLoaded) {
      return;
    }

    this.mapMarkerService.initStyleData(this.map);
    this.levelSwitchService.onInit(this.map);
    this.map.resize();
    // @ts-ignore
    this.mapService.verifySources(this.map, [
      Constants.ROUTE_SOURCE,
      Constants.WALK_SOURCE,
      ...this.mapMarkerService.sources,
    ]);
    this.addSatelliteSource(this.map);

    this.map.on('zoomend', () => this.currentZoomLevelDebouncer.next());
    this.map.on('moveend', () => this.mapCenterChangeDebouncer.next());
    // Emit initial values
    this.currentZoomLevelDebouncer.next();
    this.mapCenterChangeDebouncer.next();

    this.isStyleLoaded = true;
    this.styleLoaded.next();
    this.mapReady.next(this.map);
  }

  private addSatelliteSource(map: maplibregl.Map) {
    map.addSource(this.satelliteImageSourceName, {
      type: 'raster',
      tiles: [SATELLITE_MAP_URL_TEMPLATE],
      tileSize: SATELLITE_MAP_TILE_SIZE,
    });
  }

  /** @internal */
  // When a marker has been unselected from outside the map.
  onMarkerUnselected(): void {
    this.selectedMarker = undefined;
    this.mapMarkerService.unselectFeature(this.map);
    this.cd.detectChanges();
  }

  private getZooomLevels(): ZoomLevels {
    return {
      minZoom: MapInitService.MIN_ZOOM,
      maxZoom: MapInitService.MAX_ZOOM,
      currentZoom: this.map.getZoom(),
    };
  }

  private validateInputParameter(): void {
    if (!this.apiKey) {
      throw new Error('Input parameter apiKey is mandatory');
    }
  }

  /** @internal */
  // When a marker has been selected from outside the map.
  onMarkerSelected(marker: Marker): void {
    if (marker?.id !== this.selectedMarkerId) {
      this.selectedMarker = marker;
      this.mapMarkerService.selectMarker(this.map, marker);
      this.cd.detectChanges();
    }
  }

  /** @internal */
  computeMarkersBounds(markers: Marker[]): LngLatBounds {
    const bounds = new LngLatBounds();
    markers.forEach((marker: Marker) => {
      bounds.extend(marker.position as LngLatLike);
    });
    return bounds;
  }

  onToggleBasemap() {
    this.isSatelliteMap = !this.isSatelliteMap;
    if (this.isSatelliteMap) {
      this.map.addLayer(
        {
          id: this.satelliteLayerId,
          type: 'raster',
          source: this.satelliteImageSourceName,
          maxzoom: SATELLITE_MAP_MAX_ZOOM,
        },
        'waterName_point_other'
      );
    } else {
      this.map.removeLayer(this.satelliteLayerId);
    }
  }

  handleMarkerOrClusterClick(features: FeatureData[]) {
    const featureEventDataList = features.filter((feature) =>
      this.mapMarkerService.allMarkerAndClusterLayers.includes(feature.layer.id)
    );

    if (!featureEventDataList.length) {
      return;
    }

    let i = 0;
    let target = featureEventDataList[0];
    // The topmost rendered feature should be at position 0.
    // But it doesn't work for featureEventDataList within the same layer.
    while (target.layer.id === featureEventDataList[++i]?.layer.id) {
      if (target.properties.order < featureEventDataList[i].properties.order) {
        target = featureEventDataList[i];
      }
    }

    if (target.properties.cluster) {
      this.mapMarkerService.onClusterClicked(this.map, target);
    } else {
      const selectedMarkerId = this.mapMarkerService.onMarkerClicked(
        this.map,
        target,
        this.selectedMarkerId
      );
      this.selectedMarker = this.markerOptions.markers.find(
        (marker) => marker.id === selectedMarkerId && !!selectedMarkerId
      );
      this.cd.detectChanges();
    }
  }

  onHomeButtonClicked() {
    this.mapService.moveMap(
      this.map,
      this.mapInitService.getDefaultBoundingBox(),
      this.homeButtonBoundingBoxPadding
    );
  }
}

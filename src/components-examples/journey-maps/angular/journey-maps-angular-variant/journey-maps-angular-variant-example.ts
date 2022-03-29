import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SbbCheckboxChange } from '@sbb-esta/angular/checkbox';
import { SbbRadioChange } from '@sbb-esta/angular/radio-button';
import {
  InteractionOptions,
  JourneyMapsClientComponent,
  JourneyMapsRoutingOptions,
  ListenerTypeOptions,
  SelectionMode,
  StyleMode,
  StyleOptions,
  UIOptions,
  ViewportOptions,
  ZoomLevels,
} from '@sbb-esta/journey-maps';
import { FeatureCollection } from 'geojson';
import { LngLatBoundsLike, LngLatLike } from 'maplibre-gl';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { zhShWaldfriedhof } from './mock-response/journey/zh-sh_waldfriedhof';
import { markers } from './mock-response/markers';
import { bernIndoor } from './mock-response/transfer/bern-indoor';
import { geneveIndoor } from './mock-response/transfer/geneve-indoor';
import { luzern4j } from './mock-response/transfer/luzern4-j';
import { zurichIndoor } from './mock-response/transfer/zurich-indoor';
import { bernBurgdorfZones } from './mock-response/zone/bern-burgdorf';
import { baselBielZones } from './mock-response/zone/bs-bl';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps Angular examples
 */
@Component({
  selector: 'sbb-journey-maps-angular-variant-example',
  templateUrl: 'journey-maps-angular-variant-example.html',
  styleUrls: ['journey-maps-angular-variant-example.css'],
})
export class JourneyMapsAngularVariant implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('advancedMap')
  client: JourneyMapsClientComponent;
  @ViewChild('stationTemplate')
  stationTemplate: TemplateRef<any>;
  @ViewChild('routeTemplate')
  routeTemplate: TemplateRef<any>;

  apiKey = window.JM_API_KEY;
  mapVisible = true;
  selectedMarkerId?: string;
  selectedLevel = 0;
  mapCenter?: LngLatLike;
  mapCenterChange = new Subject<LngLatLike>();
  interactionOptions: InteractionOptions = {
    oneFingerPan: true,
    scrollZoom: true,
  };
  uiOptionsBasic: UIOptions = {
    showSmallButtons: false,
    levelSwitch: false,
    zoomControls: true,
    basemapSwitch: true,
    homeButton: true,
  };
  uiOptions: UIOptions = {
    showSmallButtons: false,
    levelSwitch: true,
    zoomControls: true,
    basemapSwitch: true,
    homeButton: true,
  };
  listenerOptions: {
    MARKER: ListenerTypeOptions;
    ROUTE: ListenerTypeOptions;
    STATION: ListenerTypeOptions;
    ZONE: ListenerTypeOptions;
  } = {
    MARKER: { watch: true, selectionMode: 'single' },
    ROUTE: { watch: true, popup: true, selectionMode: 'multi' },
    STATION: { watch: true, popup: true },
    ZONE: { watch: true, selectionMode: 'multi' },
  };
  styleOptions: StyleOptions = { brightId: 'base_bright_v2_ki' };
  markerOptions = markers;
  journeyMapsRoutingOption: JourneyMapsRoutingOptions;
  journeyMapsZones: FeatureCollection;
  journeyMapsRoutingOptions = [
    'journey',
    'transfer luzern',
    'transfer zurich indoor',
    'transfer bern indoor',
    'transfer geneve indoor',
  ];
  journeyMapsZoneOptions = ['bern-burgdorf', 'bs-bl'];
  viewportOptions: ViewportOptions = {};
  zoomLevels: ZoomLevels;
  visibleLevels = new BehaviorSubject<number[]>([]);

  private _destroyed = new Subject<void>();

  constructor(private _cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.mapCenterChange
      .pipe(takeUntil(this._destroyed))
      .subscribe((mapCenter: LngLatLike) => (this.mapCenter = mapCenter));
  }

  ngAfterViewInit() {
    if (this.listenerOptions.STATION) {
      this.listenerOptions.STATION.clickTemplate = this.stationTemplate;
    }
    if (this.listenerOptions.ROUTE) {
      this.listenerOptions.ROUTE.hoverTemplate = this.routeTemplate;
    }
    this.updateListenerOptions();
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  setShowSmallButtons(event: SbbCheckboxChange): void {
    this.uiOptions = {
      ...this.uiOptions,
      showSmallButtons: event.source.checked,
    };
  }

  setJourneyMapsRoutingInput(event: Event): void {
    this.journeyMapsRoutingOption = {};

    let bbox: number[] | undefined;
    let updateDataFunction: () => void;
    if ((event.target as HTMLOptionElement).value === 'journey') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { journey: zhShWaldfriedhof });
      bbox = zhShWaldfriedhof.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer luzern') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { transfer: luzern4j });
      bbox = luzern4j.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer zurich indoor') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { transfer: zurichIndoor });
      bbox = zurichIndoor.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer bern indoor') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { transfer: bernIndoor });
      bbox = bernIndoor.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer geneve indoor') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { transfer: geneveIndoor });
      bbox = geneveIndoor.bbox;
    }

    if (bbox) {
      this._setBbox(bbox);
      this.mapCenterChange.pipe(take(1)).subscribe(() => {
        updateDataFunction();
        this._cd.detectChanges();
      });
    }
  }

  setJourneyMapsZoneInput(event: Event): void {
    this.journeyMapsZones = undefined as any;

    if ((event.target as HTMLOptionElement).value === 'bern-burgdorf') {
      this.journeyMapsZones = bernBurgdorfZones;
    }
    if ((event.target as HTMLOptionElement).value === 'bs-bl') {
      this.journeyMapsZones = baselBielZones;
    }

    if (this.journeyMapsZones?.bbox) {
      this._setBbox(this.journeyMapsZones!.bbox);
    }
  }

  setMarkerId(event: SbbRadioChange): void {
    this.selectedMarkerId = event.value;
  }

  setStyleModeInput(event: SbbRadioChange): void {
    this.selectedMarkerId = undefined;
    this.styleOptions = {
      ...this.styleOptions,
      mode: event.value as StyleMode,
    };
  }

  setPopupInput(event: SbbRadioChange) {
    this.selectedMarkerId = undefined;
    this.markerOptions = {
      ...this.markerOptions,
      popup: event.value === 'true',
    };
  }

  setSelectedLevel(selectedLevel: number): void {
    this.selectedLevel = selectedLevel;
  }

  updateListenerOptions(): void {
    this.listenerOptions = { ...this.listenerOptions };
  }

  bboxToLngLatBounds(bbox: number[]): LngLatBoundsLike {
    return [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ];
  }

  mapCenterInfo(): { lng: number; lat: number } | undefined {
    if (!this.mapCenter) {
      return;
    }
    return this.mapCenter as { lng: number; lat: number };
  }

  private _setBbox(bbox: number[]): void {
    this.viewportOptions = {
      ...this.viewportOptions,
      boundingBox: this.bboxToLngLatBounds(bbox),
    };
  }
}

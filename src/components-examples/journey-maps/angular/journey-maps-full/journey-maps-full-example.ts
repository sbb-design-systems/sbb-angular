import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SbbRadioChange } from '@sbb-esta/angular/radio-button';
import {
  InteractionOptions,
  JourneyMapsClientComponent,
  JourneyMapsRoutingOptions,
  ListenerOptions,
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
 * @title Journey Maps Full Example
 */
@Component({
  selector: 'sbb-journey-maps-full-example',
  templateUrl: 'journey-maps-full-example.html',
  styleUrls: ['journey-maps-full-example.css'],
})
export class JourneyMapsFullExample implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('advancedMap')
  client: JourneyMapsClientComponent;
  @ViewChild('stationTemplate')
  stationTemplate: TemplateRef<any>;
  @ViewChild('routeTemplate')
  routeTemplate: TemplateRef<any>;

  apiKey = window.JM_API_KEY;
  selectedMarkerId?: string;
  mapCenter?: LngLatLike;
  mapCenterChange = new Subject<LngLatLike>();
  interactionOptions: InteractionOptions = {
    oneFingerPan: true,
    scrollZoom: true,
  };
  uiOptions: UIOptions = {
    showSmallButtons: false,
    levelSwitch: true,
    zoomControls: true,
    basemapSwitch: true,
    homeButton: true,
  };
  listenerOptions: ListenerOptions = {
    MARKER: { watch: true, selectionMode: 'single' },
    ROUTE: { watch: true, popup: true, selectionMode: 'multi' },
    STATION: { watch: true, popup: true },
    ZONE: { watch: true, selectionMode: 'multi' },
  };
  styleOptions: StyleOptions = {};
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
  form: FormGroup;
  zoomButtons = [
    { label: 'Zoom In', action: () => this.client.zoomIn() },
    { label: 'Zoom out', action: () => this.client.zoomOut() },
  ];
  moveButtons = [
    { label: 'North', action: () => this.client.moveNorth() },
    { label: 'East', action: () => this.client.moveEast() },
    { label: 'South', action: () => this.client.moveSouth() },
    { label: 'West', action: () => this.client.moveWest() },
  ];

  private _destroyed = new Subject<void>();

  constructor(private _cd: ChangeDetectorRef, private _fb: FormBuilder) {
    this.form = _fb.group({
      mapVisible: [true],
      smallControls: [false],
      mapStyle: ['bright'],
      popup: [true],
      level: [0],
      listener: _fb.group({
        marker: [true],
        route: [true],
        station: [true],
        zone: [true],
      }),
    });
  }

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

  updateUIOptions(): void {
    this.uiOptions = {
      ...this.uiOptions,
      showSmallButtons: this.form.get('smallControls')?.value,
    };
  }

  setJourneyMapsRoutingInput(event: Event): void {
    this.journeyMapsRoutingOption = {};

    let bbox: number[] | undefined;
    let updateDataFunction: () => void;
    const value = (event.target as HTMLOptionElement).value;

    if (value === 'journey') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { journey: zhShWaldfriedhof });
      bbox = zhShWaldfriedhof.bbox;
    }
    if (value === 'transfer luzern') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { transfer: luzern4j });
      bbox = luzern4j.bbox;
    }
    if (value === 'transfer zurich indoor') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { transfer: zurichIndoor });
      bbox = zurichIndoor.bbox;
    }
    if (value === 'transfer bern indoor') {
      updateDataFunction = () => (this.journeyMapsRoutingOption = { transfer: bernIndoor });
      bbox = bernIndoor.bbox;
    }
    if (value === 'transfer geneve indoor') {
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
    const value = (event.target as HTMLOptionElement).value;

    if (value === 'bern-burgdorf') {
      this.journeyMapsZones = bernBurgdorfZones;
    }
    if (value === 'bs-bl') {
      this.journeyMapsZones = baselBielZones;
    }

    if (this.journeyMapsZones?.bbox) {
      this._setBbox(this.journeyMapsZones!.bbox);
    }
  }

  setMarkerId(event: SbbRadioChange): void {
    this.selectedMarkerId = event.value;
  }

  updateStyleOptions(): void {
    this.selectedMarkerId = undefined;
    this.styleOptions = {
      ...this.styleOptions,
      mode: this.form.get('mapStyle')?.value,
    };
  }

  updateMarkerOptions() {
    this.selectedMarkerId = undefined;
    this.markerOptions = {
      ...this.markerOptions,
      popup: this.form.get('popup')?.value,
    };
  }

  updateListenerOptions(): void {
    const group = this.form.get('listener')!;
    this.listenerOptions.MARKER!.watch = group.get('marker')?.value;
    this.listenerOptions.STATION!.watch = group.get('station')?.value;
    this.listenerOptions.ROUTE!.watch = group.get('route')?.value;
    this.listenerOptions.ZONE!.watch = group.get('zone')?.value;
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

  listenerOptionTypes() {
    return Object.keys(this.listenerOptions).map((key) => key.toLowerCase());
  }

  private _setBbox(bbox: number[]): void {
    this.viewportOptions = {
      ...this.viewportOptions,
      boundingBox: this.bboxToLngLatBounds(bbox),
    };
  }
}

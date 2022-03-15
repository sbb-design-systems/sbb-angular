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
import { bernBurgdorfZones } from '@sbb-esta/components-examples/journey-maps/angular/angular/test-data/zone/bern-burgdorf';
import { baselBielZones } from '@sbb-esta/components-examples/journey-maps/angular/angular/test-data/zone/bs-bl';
import {
  InteractionOptions,
  JourneyMapsClientComponent,
  JourneyMapsRoutingOptions,
  ListenerOptions,
  ListenerTypeOptions,
  SelectionMode,
  StyleMode,
  StyleOptions,
  UIOptions,
  ViewportOptions,
  ZoomLevels,
} from '@sbb-esta/journey-maps';
import { FeatureCollection } from 'geojson';
import { LngLatLike } from 'maplibre-gl';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { zhShWaldfriedhof } from './test-data/journey/zh-sh_waldfriedhof';
import { markers } from './test-data/markers';
import { bernIndoor } from './test-data/transfer/bern-indoor';
import { geneveIndoor } from './test-data/transfer/geneve-indoor';
import { luzern4j } from './test-data/transfer/luzern4-j';
import { zurichIndoor } from './test-data/transfer/zurich-indoor';

/**
 * @title Journey Maps Angular examples
 */
@Component({
  selector: 'sbb-angular-example',
  templateUrl: 'angular-example.html',
  styleUrls: ['angular-example.css'],
})
export class Angular implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(JourneyMapsClientComponent)
  client: JourneyMapsClientComponent;
  @ViewChild('stationTemplate')
  stationTemplate: TemplateRef<any>;
  @ViewChild('routeTemplate')
  routeTemplate: TemplateRef<any>;

  // @ts-ignore
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
    MARKER: { watch: true, selectionMode: SelectionMode.Single },
    ROUTE: { watch: true, popup: true, selectionMode: SelectionMode.Multi },
    STATION: { watch: true, popup: true },
    ZONE: { watch: true, selectionMode: SelectionMode.Multi },
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
  visibleLevels$ = new BehaviorSubject<number[]>([]);

  private _destroyed = new Subject<void>();

  constructor(private _cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.mapCenterChange
      .pipe(takeUntil(this._destroyed))
      .subscribe((mapCenter) => (this.mapCenter = mapCenter));
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

    let bbox;
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
      mode: StyleMode[event.value as StyleMode],
    };
  }

  setSelectedLevel(selectedLevel: number): void {
    this.selectedLevel = selectedLevel;
  }

  updateListenerOptions(): void {
    this.listenerOptions = { ...this.listenerOptions };
  }

  private _setBbox(bbox: number[]): void {
    this.viewportOptions = {
      ...this.viewportOptions,
      boundingBox: [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
    };
  }
}

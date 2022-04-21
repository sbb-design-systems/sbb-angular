import {
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
  SbbInteractionOptions,
  SbbJourneyMaps,
  SbbJourneyMapsRoutingOptions,
  SbbViewportOptions,
  SbbZoomLevels,
} from '@sbb-esta/journey-maps';
import { LngLatBounds, LngLatBoundsLike, LngLatLike } from 'maplibre-gl';
import { BehaviorSubject, filter, Subject, take } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { zhShWaldfriedhof } from './mock-response/journey/zh-sh_waldfriedhof';
import { markers } from './mock-response/markers';
import { bnLsRoutes } from './mock-response/routes/bn-ls';
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
export class JourneyMapsFullExample implements OnInit, OnDestroy {
  @ViewChild('advancedMap')
  client: SbbJourneyMaps;
  @ViewChild('stationTemplate', { static: true })
  stationTemplate: TemplateRef<any>;
  @ViewChild('routeTemplate', { static: true })
  routeTemplate: TemplateRef<any>;

  apiKey = window.JM_API_KEY;
  selectedMarkerId?: string;
  mapCenter?: LngLatLike;
  mapCenterChange = new Subject<LngLatLike>();
  interactionOptions: SbbInteractionOptions = {
    oneFingerPan: true,
    scrollZoom: true,
  };

  journeyMapsZoneOptions = [
    { label: '(none)', value: undefined },
    { label: 'Berne / Burgdorf', value: bernBurgdorfZones },
    { label: 'Basel / Biel', value: baselBielZones },
  ];
  journeyMapsRoutingOption: SbbJourneyMapsRoutingOptions;
  journeyMapsRoutingOptions = [
    { label: '(none)', value: undefined },
    { label: 'Zürich - Schaffhausen, Waldfriedhof', value: { journey: zhShWaldfriedhof } },
    { label: 'Bern - Lausanne', value: { routes: bnLsRoutes } },
    { label: 'Transfer Bern', value: { transfer: bernIndoor } },
    { label: 'Transfer Genf', value: { transfer: geneveIndoor } },
    { label: 'Transfer Luzern', value: { transfer: luzern4j } },
    { label: 'Transfer Zürich', value: { transfer: zurichIndoor } },
  ];
  viewportOptions: SbbViewportOptions = {};
  zoomLevels: SbbZoomLevels;
  visibleLevels = new BehaviorSubject<number[]>([]);
  form: FormGroup;

  private _destroyed = new Subject<void>();

  constructor(private _cd: ChangeDetectorRef, private _fb: FormBuilder) {
    // Pseudo validator to reset the selected marker id before the value changes
    const resetSelectedMarkerIdValidator = () => {
      this.selectedMarkerId = undefined;
      return null;
    };

    this.form = _fb.group({
      mapVisible: [true],
      level: [0],
      uiOptions: _fb.group({
        showSmallButtons: [false],
        levelSwitch: [true],
        zoomControls: [true],
        basemapSwitch: [true],
        homeButton: [true],
      }),
      styleOptions: _fb.group({
        mode: ['bright', resetSelectedMarkerIdValidator],
      }),
      listenerOptions: _fb.group({
        MARKER: _fb.group({
          watch: [true],
          selectionMode: ['single'],
        }),
        ROUTE: _fb.group({
          watch: [true],
          popup: [true],
          selectionMode: ['multi'],
          hoverTemplate: [],
        }),
        STATION: _fb.group({
          watch: [true],
          popup: [true],
          clickTemplate: [],
        }),
        ZONE: _fb.group({
          watch: [true],
          selectionMode: ['multi'],
        }),
      }),
      markerOptions: _fb.group({
        zoomToMarkers: [true],
        popup: [true, resetSelectedMarkerIdValidator],
        markers: [markers],
      }),
      zoneGeoJson: [],
      routingGeoJson: [],
    });
  }

  ngOnInit() {
    this.mapCenterChange
      .pipe(takeUntil(this._destroyed))
      .subscribe((mapCenter: LngLatLike) => (this.mapCenter = mapCenter));

    this.form.get('listenerOptions.ROUTE')?.patchValue({ hoverTemplate: this.routeTemplate });
    this.form.get('listenerOptions.STATION')?.patchValue({ clickTemplate: this.stationTemplate });

    this.form
      .get('zoneGeoJson')
      ?.valueChanges.pipe(
        takeUntil(this._destroyed),
        map((val: GeoJSON.FeatureCollection) => val?.bbox),
        filter((bbox) => !!bbox)
      )
      .subscribe((bbox) => this._setBbox(bbox!));

    this.form
      .get('routingGeoJson')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe((val: SbbJourneyMapsRoutingOptions) => {
        const bbox = this._getBbox(val);
        if (bbox) {
          this._setBbox(bbox);
          this.mapCenterChange.pipe(take(1)).subscribe(() => {
            // Wait until map is idle. So that the correct starting level will be displayed.
            this.journeyMapsRoutingOption = val;
            this._cd.detectChanges();
          });
        } else {
          this.journeyMapsRoutingOption = val;
        }
      });
  }

  private _getBbox(options: SbbJourneyMapsRoutingOptions) {
    if (!options) {
      return;
    }

    if (options.journey) {
      return options.journey.bbox;
    }
    if (options.transfer) {
      return options.transfer.bbox;
    }

    if (options.routes) {
      const bounds = new LngLatBounds();
      options.routes
        .filter((r) => r.bbox)
        .forEach((r) => bounds.extend(r.bbox as [number, number, number, number]));

      return bounds;
    }

    return;
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  setMarkerId(event: SbbRadioChange): void {
    this.selectedMarkerId = event.value;
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
    const listenerOptions: FormGroup = this.form.get('listenerOptions') as FormGroup;
    return Object.keys(listenerOptions.controls);
  }

  private _setBbox(bbox: number[] | LngLatBounds): void {
    this.viewportOptions = {
      ...this.viewportOptions,
      boundingBox: this._isLngLatBounds(bbox) ? bbox : this.bboxToLngLatBounds(bbox),
    };
  }

  private _isLngLatBounds(bbox: number[] | LngLatBounds): bbox is LngLatBounds {
    return (bbox as LngLatBounds).getWest !== undefined;
  }
}

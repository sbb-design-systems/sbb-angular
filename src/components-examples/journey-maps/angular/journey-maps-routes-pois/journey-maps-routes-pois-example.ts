import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import {
  POI_CATEGORIES,
  STYLE_IDS,
} from '@sbb-esta/components-examples/journey-maps/angular/shared/config';
import { markers } from '@sbb-esta/components-examples/journey-maps/angular/shared/markers';
import {
  SbbJourneyMaps,
  SbbJourneyMapsModule,
  SbbJourneyMapsRoutingOptions,
  SbbViewportDimensions,
  SbbZoomLevels,
} from '@sbb-esta/journey-maps';
import { Feature, FeatureCollection, Polygon, Position } from 'geojson';
import { LngLatBounds, LngLatBoundsLike, LngLatLike } from 'maplibre-gl';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { bielLyssRoutes, bielLyssRoutesOptions } from '../shared/routes/biel-lyss';
import { bnLsRoutes, bnLsRoutesOptions } from '../shared/routes/bn-ls';
import { tripBeSh } from '../shared/trip/be-sh';
import { tripZhBeWyleregg } from '../shared/trip/zh-be_wyleregg';
import { tripZhShWaldfriedhof } from '../shared/trip/zh-sh_waldfriedhof';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps - SBB Map Routes, POIs & Markers
 * @includeExtraFiles ../shared/config.ts,../shared/markers.ts,../shared/trip/be-sh.ts,../shared/trip/zh-be_wyleregg.ts,../shared/trip/zh-sh_waldfriedhof.ts,../shared/routes/biel-lyss.ts,../shared/routes/bn-ls.ts
 * @order 6
 *  */

@Component({
  selector: 'sbb-journey-maps-routes-pois-example',
  templateUrl: 'journey-maps-routes-pois-example.html',
  styleUrls: ['journey-maps-routes-pois-example.css'],
  imports: [
    SbbJourneyMapsModule,
    SbbNotificationModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbOptionModule,
    SbbRadioButtonModule,
    SbbSelectModule,
    SbbFormFieldModule,
    SbbButtonModule,
    SbbIconModule,
    SbbInputModule,
    AsyncPipe,
  ],
})
export class JourneyMapsRoutesPoisExample implements OnInit {
  apiKey = window.JM_API_KEY;
  selectedMarkerId?: string;
  form!: UntypedFormGroup;
  @ViewChild('advancedMap')
  client!: SbbJourneyMaps;
  @ViewChild('stationTemplate', { static: true })
  stationTemplate!: TemplateRef<any>;
  @ViewChild('routeTemplate', { static: true })
  routeTemplate!: TemplateRef<any>;
  journeyMapsRoutingLegIds: string[] = [];
  journeyMapsRoutingOption?: SbbJourneyMapsRoutingOptions;
  visibleLevels = new BehaviorSubject<number[]>([]);
  @ViewChild('poiTemplate', { static: true })
  poiTemplate!: TemplateRef<any>;
  mapCenterChange = new Subject<LngLatLike>();
  mapBoundingBoxChange = new Subject<number[][]>();
  zoomLevels?: SbbZoomLevels;
  mapCenter?: LngLatLike;
  mapBoundingBox?: number[][];
  viewportDimensions?: SbbViewportDimensions;

  constructor(
    private fb: FormBuilder,
    private _cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.subscribeMapCenterChange();
    this.subscribeBoundingBoxChange();
    this.subscribeStyleVersion();
    this.subscribeRoutingGeoJson();
    this.subscribeRoutingLed();
    this.form.get('listenerOptions.ROUTE')?.patchValue({ hoverTemplate: this.routeTemplate });
    this.form.get('listenerOptions.STATION')?.patchValue({ hoverTemplate: this.stationTemplate });
    this.form.get('listenerOptions.POI')?.patchValue({ clickTemplate: this.poiTemplate });
    this._cd.detectChanges();
  }

  listenerOptionTypes() {
    const listenerOptions: UntypedFormGroup = this.form.get('listenerOptions') as UntypedFormGroup;
    return Object.keys(listenerOptions.controls);
  }

  changeSelectedLevel(level: number | undefined) {
    this.form.patchValue({ level });
  }

  bboxToLngLatBounds(bbox: number[]): LngLatBoundsLike {
    return [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ];
  }

  private buildForm() {
    this.form = this.fb.group({
      level: [undefined],
      selectedPoi: this.fb.group({
        poiId: [undefined, Validators.required],
      }),
      pointsOfInterestOptions: this.fb.group({
        categories: [POI_CATEGORIES],
        environment: ['prod'],
        includePreview: [false],
      }),
      listenerOptions: this.fb.group({
        MARKER: this.fb.group({
          watch: [true],
          selectionMode: ['single'],
        }),
        POI: this.fb.group({
          watch: [true],
          popup: [false],
          selectionMode: ['single'],
          clickTemplate: [],
        }),
        ROUTE: this.fb.group({
          watch: [true],
          popup: [false],
          clickTemplate: this.routeTemplate,
        }),
        STATION: this.fb.group({
          watch: [true],
          popup: [true],
          clickTemplate: [],
        }),
        ZONE: this.fb.group({
          watch: [true],
          selectionMode: ['multi'],
        }),
      }),
      markerOptions: this.fb.group({
        zoomToMarkers: [true],
        popup: [true, this.resetSelectedMarkerIdValidator],
        markers: [markers],
      }),
      styleOptions: this.fb.group({
        mode: ['bright', this.resetSelectedMarkerIdValidator],
        ...STYLE_IDS.v3,
      }),
      styleVersion: this.fb.group({
        versionNumber: ['v3', this.resetSelectedMarkerIdValidator],
      }),
      viewportBounds: this.fb.group({
        minZoomLevel: [1],
        maxZoomLevel: [23],
        maxBounds: [],
      }),
      routingGeoJson: [],
      routingLegId: [],
    });
  }

  private subscribeRoutingGeoJson() {
    this.form
      .get('routingGeoJson')
      ?.valueChanges.pipe(takeUntil(this.destroyed))
      .subscribe((routingOption?: SbbJourneyMapsRoutingOptions) => {
        this.form.get('routingLegId')?.reset(); // calling this later has unintended side effects on bbox
        const bbox = this.getBbox(routingOption);
        if (bbox) {
          this.setBbox(bbox);
          this.mapCenterChange.pipe(take(1)).subscribe(() => {
            // Wait until map is idle. So that the correct starting level will be displayed.
            this.journeyMapsRoutingOption = routingOption;
            console.log(routingOption);
            this._cd.detectChanges();
          });
        } else {
          this.journeyMapsRoutingOption = routingOption;
        }
        this.journeyMapsRoutingLegIds = this._distinct(
          routingOption?.journey?.features.map((f) => f.properties?.legId) ?? [],
        )
          .filter((x) => x)
          .sort();
      });
  }

  private subscribeRoutingLed() {
    this.form
      .get('routingLegId')
      ?.valueChanges.pipe(takeUntil(this.destroyed))
      .subscribe((selectedLegId: string) => {
        // 'journeyMapsRoutingOption' can be null on .reset() of its dropdown form data
        if (this.journeyMapsRoutingOption?.journey) {
          const bbox = selectedLegId
            ? this.getBboxForLegId(selectedLegId, this.journeyMapsRoutingOption.journey)
            : this.getBbox(this.journeyMapsRoutingOption);
          if (bbox) {
            this.setBbox(bbox!);
          }
          this.mapCenterChange.pipe(take(1)).subscribe(() => {
            // Wait until map is idle. So that the correct starting level will be displayed.
            this.journeyMapsRoutingOption = {
              ...this.journeyMapsRoutingOption,
              journeyMetaInformation: { selectedLegId },
            };
            this._cd.detectChanges();
          });
        }
      });
  }

  private setBbox(bbox: number[] | LngLatBounds): void {
    console.log('setBbox', bbox);
    this.viewportDimensions = {
      boundingBox: this.isLngLatBounds(bbox) ? bbox : this.bboxToLngLatBounds(bbox),
    };
  }

  private isLngLatBounds(bbox: number[] | LngLatBounds): bbox is LngLatBounds {
    return (bbox as LngLatBounds).getWest !== undefined;
  }

  private _distinct<T>(vals: T[]): T[] {
    return vals.filter((value, index, self) => self.indexOf(value) === index);
  }

  private getBboxForLegId(selectedLegId: string, journey: FeatureCollection): number[] | undefined {
    const legBbox: Feature | undefined = journey.features.find(
      (f) => f.properties?.type === 'bbox' && f.properties?.legId === selectedLegId,
    );
    if (legBbox) {
      const p: Position[] = (legBbox.geometry as Polygon).coordinates[0];
      return [...p[0], ...p[2]];
    }
    return undefined;
  }

  private getBbox(options?: SbbJourneyMapsRoutingOptions) {
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

  private destroyed = new Subject<void>();

  protected readonly JOURNEY_MAPS_DEFAULT_ROUTING_OPTIONS = JOURNEY_MAPS_DEFAULT_ROUTING_OPTIONS;

  private subscribeBoundingBoxChange() {
    this.mapBoundingBoxChange
      .pipe(takeUntil(this._destroyed))
      .subscribe((mapBoundingBox: number[][]) => (this.mapBoundingBox = mapBoundingBox));
  }

  private subscribeMapCenterChange() {
    this.mapCenterChange
      .pipe(takeUntil(this._destroyed))
      .subscribe((mapCenter: LngLatLike) => (this.mapCenter = mapCenter));
  }

  private subscribeStyleVersion() {
    this.form
      .get('styleVersion')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe(({ versionNumber }: { versionNumber: 'v2' | 'v3' }) => {
        this.form.get('styleOptions')?.patchValue({
          ...this.form.get('styleOptions')?.value,
          ...STYLE_IDS[versionNumber],
        });
      });
  }

  private resetSelectedMarkerIdValidator = () => {
    this.selectedMarkerId = undefined;
    return null;
  };

  private _destroyed = new Subject<void>();
  protected readonly POI_CATEGORIES = POI_CATEGORIES;
}

const JOURNEY_MAPS_DEFAULT_ROUTING_OPTIONS: {
  label: string;
  value: SbbJourneyMapsRoutingOptions | undefined;
}[] = [
  { label: '(none)', value: undefined },
  {
    label: 'Zürich - Bern, Wyleregg',
    value: { journey: tripZhBeWyleregg },
  },
  {
    label: 'Zürich - Schaffhausen, Waldfriedhof',
    value: { journey: tripZhShWaldfriedhof },
  },
  {
    label: 'Bern - Schaffhausen',
    value: { journey: tripBeSh },
  },
  {
    label: 'Bern - Lausanne',
    value: {
      routes: bnLsRoutes,
      routesMetaInformations: bnLsRoutesOptions,
    },
  },
  {
    label: 'Biel - Lyss',
    value: {
      routes: bielLyssRoutes,
      routesMetaInformations: bielLyssRoutesOptions,
    },
  },
];

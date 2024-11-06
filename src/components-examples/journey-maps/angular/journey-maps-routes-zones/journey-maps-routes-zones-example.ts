import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
  SbbJourneyMaps,
  SbbJourneyMapsModule,
  SbbJourneyRoutesOptions,
  SbbViewportDimensions,
  SbbZoomLevels,
} from '@sbb-esta/journey-maps';
import { Feature, FeatureCollection, Polygon, Position } from 'geojson';
import { LngLatBounds, LngLatBoundsLike, LngLatLike } from 'maplibre-gl';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { bielLyssRoutes, bielLyssRoutesOptions } from '../shared/routes/biel-lyss';
import { bnLsRoutes, bnLsRoutesOptions } from '../shared/routes/bn-ls';
import { tripBeSh } from '../shared/trip/be-sh';
import { tripZhBeWyleregg } from '../shared/trip/zh-be_wyleregg';
import { tripZhShWaldfriedhof } from '../shared/trip/zh-sh_waldfriedhof';
import { bernBurgdorfZones } from '../shared/zone/bern-burgdorf';
import { baselBielZones } from '../shared/zone/bs-bl';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps - SBB Map Routes & Zones
 * @includeExtraFiles ../shared/config.ts,../shared/markers.ts,../shared/trip/be-sh.ts,../shared/trip/zh-be_wyleregg.ts,../shared/trip/zh-sh_waldfriedhof.ts,../shared/routes/biel-lyss.ts,../shared/routes/bn-ls.ts,../shared/zone/bern-burgdorf.ts,../shared/zone/bs-bl.ts
 * @order 6
 *  */

@Component({
  selector: 'sbb-journey-maps-routes-zones-example',
  templateUrl: 'journey-maps-routes-zones-example.html',
  styleUrls: ['journey-maps-routes-zones-example.css'],
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
export class JourneyMapsRoutesZonesExample implements OnInit {
  apiKey = window.JM_API_KEY;
  form: UntypedFormGroup;
  @ViewChild('advancedMap')
  client: SbbJourneyMaps;
  @ViewChild('stationTemplate', { static: true })
  stationTemplate: TemplateRef<any>;
  @ViewChild('routeTemplate', { static: true })
  routeTemplate: TemplateRef<any>;
  journeyMapsRoutingLegIds: string[] = [];
  visibleLevels = new BehaviorSubject<number[]>([]);
  mapCenterChange = new Subject<LngLatLike>();
  mapBoundingBoxChange = new Subject<number[][]>();
  zoomLevels?: SbbZoomLevels;
  viewportDimensions?: SbbViewportDimensions;
  journeyRoutesOption?: SbbJourneyRoutesOptions;

  constructor(
    private _cd: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.subscribeZoneGeoJson();
    this.subscribeRoutingGeoJson();
    this.subscribeRoutingLed();
    this.form.get('listenerOptions.ROUTE')?.patchValue({ hoverTemplate: this.routeTemplate });
    this.form.get('listenerOptions.STATION')?.patchValue({ clickTemplate: this.stationTemplate });
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
      listenerOptions: this.fb.group({
        ROUTE: this.fb.group({
          watch: [true],
          popup: [true],
          selectionMode: ['multi'],
          hoverTemplate: [],
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
      viewportBounds: this.fb.group({
        minZoomLevel: [1],
        maxZoomLevel: [23],
        maxBounds: [],
      }),
      zoneGeoJson: [],
      routingGeoJson: [],
      routingLegId: [],
    });
  }

  private subscribeZoneGeoJson() {
    console.log('subscribeZoneGeoJson');
    this.form
      .get('zoneGeoJson')
      ?.valueChanges.pipe(
        takeUntil(this.destroyed),
        map((val: GeoJSON.FeatureCollection) => val?.bbox),
        filter((bbox) => !!bbox),
      )
      .subscribe((bbox) => this.setBbox(bbox!));
  }

  private subscribeRoutingGeoJson() {
    this.form
      .get('routingGeoJson')
      ?.valueChanges.pipe(takeUntil(this.destroyed))
      .subscribe((routingOption?: SbbJourneyRoutesOptions) => {
        this.form.get('routingLegId')?.reset(); // calling this later has unintended side effects on bbox
        const bbox = this.getBbox(routingOption);
        if (bbox) {
          this.setBbox(bbox);
          this.mapCenterChange.pipe(take(1)).subscribe(() => {
            // Wait until map is idle. So that the correct starting level will be displayed.
            this.journeyRoutesOption = routingOption;
            this._cd.detectChanges();
          });
        } else {
          this.journeyRoutesOption = routingOption;
        }
        this.journeyMapsRoutingLegIds = this._distinct(
          routingOption?.trip?.features.map((f) => f.properties?.legId) ?? [],
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
        if (this.journeyRoutesOption?.trip) {
          const bbox = selectedLegId
            ? this.getBboxForLegId(selectedLegId, this.journeyRoutesOption.trip)
            : this.getBbox(this.journeyRoutesOption);
          if (bbox) {
            this.setBbox(bbox!);
          }
          this.mapCenterChange.pipe(take(1)).subscribe(() => {
            // Wait until map is idle. So that the correct starting level will be displayed.
            this.journeyRoutesOption = {
              ...this.journeyRoutesOption,
              tripMetaInformation: { selectedLegId },
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

  private getBbox(options?: SbbJourneyRoutesOptions) {
    if (!options) {
      return;
    }

    if (options.trip) {
      return options.trip.bbox;
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

  protected readonly JOURNEY_MAPS_DEFAULT_ZONE_OPTIONS = JOURNEY_MAPS_DEFAULT_ZONE_OPTIONS;
  protected readonly JOURNEY_MAPS_DEFAULT_ROUTING_OPTIONS = JOURNEY_MAPS_DEFAULT_ROUTING_OPTIONS;
}

const JOURNEY_MAPS_DEFAULT_ZONE_OPTIONS = [
  { label: '(none)', value: undefined },
  { label: 'Berne / Burgdorf', value: bernBurgdorfZones },
  { label: 'Basel / Biel', value: baselBielZones },
];
const JOURNEY_MAPS_DEFAULT_ROUTING_OPTIONS: {
  label: string;
  value: SbbJourneyRoutesOptions | undefined;
}[] = [
  { label: '(none)', value: undefined },
  {
    label: 'Zürich - Bern, Wyleregg',
    value: { trip: tripZhBeWyleregg },
  },
  {
    label: 'Zürich - Schaffhausen, Waldfriedhof',
    value: { trip: tripZhShWaldfriedhof },
  },
  {
    label: 'Bern - Schaffhausen',
    value: { trip: tripBeSh },
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

import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  SbbInteractionOptions,
  SbbJourneyMaps,
  SbbJourneyMapsRoutingOptions,
  SbbViewportDimensions,
  SbbZoomLevels,
  SBB_BOUNDING_BOX,
} from '@sbb-esta/journey-maps';
import { Feature, Polygon, Position } from 'geojson';
import { LngLatBounds, LngLatBoundsLike, LngLatLike } from 'maplibre-gl';
import { BehaviorSubject, filter, Subject, take } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { zhBeWyleregg } from './mock-response/journey/zh-be_wyleregg';
import { zhShWaldfriedhof } from './mock-response/journey/zh-sh_waldfriedhof';
import { markers } from './mock-response/markers';
import { bielLyssRoutes, bielLyssRoutesOptions } from './mock-response/routes/biel-lyss';
import { bnLsRoutes, bnLsRoutesOptions } from './mock-response/routes/bn-ls';
import { bernIndoor } from './mock-response/transfer/bern-indoor';
import { geneveIndoor } from './mock-response/transfer/geneve-indoor';
import { luzern4j } from './mock-response/transfer/luzern4-j';
import { zurichIndoor } from './mock-response/transfer/zurich-indoor';
import { bernBurgdorfZones } from './mock-response/zone/bern-burgdorf';
import { baselBielZones } from './mock-response/zone/bs-bl';

const CH_BOUNDS: LngLatBoundsLike = [
  [5.7349, 45.6755],
  [10.6677, 47.9163],
];

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
  @ViewChild('poiTemplate', { static: true })
  poiTemplate: TemplateRef<any>;

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
  journeyMapsRoutingOption?: SbbJourneyMapsRoutingOptions;
  journeyMapsRoutingOptions: { label: string; value: SbbJourneyMapsRoutingOptions | undefined }[] =
    [
      { label: '(none)', value: undefined },
      { label: 'Zürich - Bern, Wyleregg', value: { journey: zhBeWyleregg } },
      { label: 'Zürich - Schaffhausen, Waldfriedhof', value: { journey: zhShWaldfriedhof } },
      {
        label: 'Bern - Lausanne',
        value: { routes: bnLsRoutes, routesMetaInformations: bnLsRoutesOptions },
      },
      {
        label: 'Biel - Lyss',
        value: { routes: bielLyssRoutes, routesMetaInformations: bielLyssRoutesOptions },
      },
      { label: 'Transfer Bern', value: { transfer: bernIndoor } },
      { label: 'Transfer Genf', value: { transfer: geneveIndoor } },
      { label: 'Transfer Luzern', value: { transfer: luzern4j } },
      { label: 'Transfer Zürich', value: { transfer: zurichIndoor } },
    ];
  journeyMapsRoutingLegIds: string[] = [];
  homeButtonOptions: SbbViewportDimensions = { boundingBox: SBB_BOUNDING_BOX };
  viewportDimensions?: SbbViewportDimensions;
  zoomLevels?: SbbZoomLevels;
  visibleLevels = new BehaviorSubject<number[]>([]);
  form: UntypedFormGroup;

  private _styleIds = {
    v1: { brightId: 'base_bright_v2_ki', darkId: 'base_dark_v2_ki' },
    v2: { brightId: 'base_bright_v2_ki_v2', darkId: 'base_dark_v2_ki_v2' },
  };
  private _destroyed = new Subject<void>();

  constructor(private _cd: ChangeDetectorRef, private _fb: UntypedFormBuilder) {
    // Pseudo validator to reset the selected marker id before the value changes
    const resetSelectedMarkerIdValidator = () => {
      this.selectedMarkerId = undefined;
      return null;
    };

    this.form = _fb.group({
      mapVisible: [true],
      limitMaxBounds: [false],
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
        ...this._styleIds.v2,
      }),
      styleVersion: _fb.group({
        versionNumber: ['v2', resetSelectedMarkerIdValidator],
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
        POI: _fb.group({
          watch: [true],
          popup: [false],
          selectionMode: ['single'],
          clickTemplate: [],
        }),
      }),
      markerOptions: _fb.group({
        zoomToMarkers: [true],
        popup: [true, resetSelectedMarkerIdValidator],
        markers: [markers],
      }),
      viewportBounds: _fb.group({
        minZoomLevel: [1],
        maxZoomLevel: [23],
        maxBounds: [],
      }),
      pointsOfInterestOptions: _fb.group({
        categories: [['park_rail', 'car_sharing', 'bike_parking', 'bike_sharing']],
        environment: ['prod'], // Can also be left empty
      }),
      zoneGeoJson: [],
      routingGeoJson: [],
      routingLegId: [],
    });
  }

  ngOnInit() {
    this.mapCenterChange
      .pipe(takeUntil(this._destroyed))
      .subscribe((mapCenter: LngLatLike) => (this.mapCenter = mapCenter));

    this.form.get('listenerOptions.ROUTE')?.patchValue({ hoverTemplate: this.routeTemplate });
    this.form.get('listenerOptions.STATION')?.patchValue({ clickTemplate: this.stationTemplate });
    this.form.get('listenerOptions.POI')?.patchValue({ clickTemplate: this.poiTemplate });

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
      .subscribe((routingOption?: SbbJourneyMapsRoutingOptions) => {
        this.form.get('routingLegId')?.reset(); // calling this later has unintended side effects on bbox
        const bbox = this._getBbox(routingOption);
        if (bbox) {
          this._setBbox(bbox);
          this.mapCenterChange.pipe(take(1)).subscribe(() => {
            // Wait until map is idle. So that the correct starting level will be displayed.
            this.journeyMapsRoutingOption = routingOption;
            this._cd.detectChanges();
          });
        } else {
          this.journeyMapsRoutingOption = routingOption;
        }
        this.journeyMapsRoutingLegIds = this._distinct(
          routingOption?.journey?.features.map((f) => f.properties?.legId) ?? []
        )
          .filter((x) => x)
          .sort();
      });

    this.form
      .get('routingLegId')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe((selectedLegId: string) => {
        // 'journeyMapsRoutingOption' can be null on .reset() of its dropdown form data
        if (this.journeyMapsRoutingOption) {
          const bbox = selectedLegId
            ? this._getBboxForLegId(selectedLegId, this.journeyMapsRoutingOption)
            : this._getBbox(this.journeyMapsRoutingOption);
          if (bbox) {
            this._setBbox(bbox!);
          }
          this.journeyMapsRoutingOption = {
            ...this.journeyMapsRoutingOption,
            journeyMetaInformation: { selectedLegId },
          };
        }
      });

    this.form
      .get('limitMaxBounds')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe((limitMaxBounds: boolean) =>
        this.form
          .get('viewportBounds.maxBounds')
          ?.patchValue(limitMaxBounds ? CH_BOUNDS : undefined)
      );

    this.form
      .get('styleVersion')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe(({ versionNumber }: { versionNumber: 'v1' | 'v2' }) => {
        this.form.get('styleOptions')?.patchValue({
          ...this.form.get('styleOptions')?.value,
          ...this._styleIds[versionNumber],
        });
        this.form.get('zoneGeoJson')?.reset();
        this.form.get('routingGeoJson')?.reset();
        this.form.get('routingLegId')?.reset();
      });

    this.form
      .get('styleOptions')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe((_) => {
        this.form.get('zoneGeoJson')?.reset();
        this.form.get('routingGeoJson')?.reset();
        this.form.get('routingLegId')?.reset();
      });
  }

  private _getBboxForLegId(
    selectedLegId: string,
    routingOptions?: SbbJourneyMapsRoutingOptions
  ): number[] | undefined {
    const legBbox: Feature | undefined = routingOptions?.journey?.features.find(
      (f) => f.properties?.type === 'bbox' && f.properties?.legId === selectedLegId
    );
    if (legBbox) {
      const p: Position[] = (legBbox.geometry as Polygon).coordinates[0];
      return [...p[0], ...p[2]];
    }
    return undefined;
  }

  private _getBbox(options?: SbbJourneyMapsRoutingOptions) {
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
    const listenerOptions: UntypedFormGroup = this.form.get('listenerOptions') as UntypedFormGroup;
    return Object.keys(listenerOptions.controls);
  }

  private _setBbox(bbox: number[] | LngLatBounds): void {
    this.viewportDimensions = {
      boundingBox: this._isLngLatBounds(bbox) ? bbox : this.bboxToLngLatBounds(bbox),
    };
  }

  private _isLngLatBounds(bbox: number[] | LngLatBounds): bbox is LngLatBounds {
    return (bbox as LngLatBounds).getWest !== undefined;
  }

  private _distinct<T>(vals: T[]): T[] {
    return vals.filter((value, index, self) => self.indexOf(value) === index);
  }
}

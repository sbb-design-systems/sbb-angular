import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  SbbJourneyMaps,
  SbbJourneyMapsModule,
  SbbStyleOptions,
  SbbZoomLevels,
} from '@sbb-esta/journey-maps';
import { LngLatLike } from 'maplibre-gl';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { POI_CATEGORIES } from '../shared/config';
import { markers } from '../shared/markers';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps - SBB Map POIs & Markers
 * @includeExtraFiles ../shared/config.ts,../shared/markers.ts
 * @order 5
 */

@Component({
  selector: 'sbb-journey-maps-pois-markers-example',
  templateUrl: 'journey-maps-pois-markers-example.html',
  styleUrls: ['journey-maps-pois-markers-example.css'],
  standalone: true,
  imports: [
    SbbJourneyMapsModule,
    SbbNotificationModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbOptionModule,
    SbbRadioButtonModule,
    SbbSelectModule,
    SbbFormFieldModule,
    DecimalPipe,
    SbbButtonModule,
    SbbIconModule,
    SbbInputModule,
    TitleCasePipe,
  ],
})
export class JourneyMapsPoisMarkersExample implements OnInit {
  apiKey = window.JM_API_KEY;
  styleOptions: SbbStyleOptions = {
    brightId: 'journey_maps_bright_v1',
    darkId: 'journey_maps_dark_v1',
    aerialId: 'journey_maps_aerial_v1',
  };
  selectedMarkerId?: string;
  form: UntypedFormGroup;
  @ViewChild('advancedMap')
  client: SbbJourneyMaps;
  @ViewChild('poiTemplate', { static: true })
  poiTemplate: TemplateRef<any>;
  mapCenterChange = new Subject<LngLatLike>();
  mapBoundingBoxChange = new Subject<number[][]>();
  zoomLevels?: SbbZoomLevels;
  visibleLevels = new BehaviorSubject<number[]>([]);
  mapCenter?: LngLatLike;
  mapBoundingBox?: number[][];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.subscribeMapCenterChange();
    this.subscribeBoundingBoxChange();
    this.form.get('listenerOptions.POI')?.patchValue({ clickTemplate: this.poiTemplate });
  }

  listenerOptionTypes() {
    const listenerOptions: UntypedFormGroup = this.form.get('listenerOptions') as UntypedFormGroup;
    return Object.keys(listenerOptions.controls);
  }

  private buildForm() {
    this.form = this.fb.group({
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
      }),
      markerOptions: this.fb.group({
        zoomToMarkers: [true],
        popup: [true, this.resetSelectedMarkerIdValidator],
        markers: [markers],
      }),
    });
  }

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

  private resetSelectedMarkerIdValidator = () => {
    this.selectedMarkerId = undefined;
    return null;
  };

  private _destroyed = new Subject<void>();
  protected readonly POI_CATEGORIES = POI_CATEGORIES;
}

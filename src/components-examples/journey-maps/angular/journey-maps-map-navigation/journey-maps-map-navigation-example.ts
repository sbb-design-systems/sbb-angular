import { DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
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
  SbbInteractionOptions,
  SbbJourneyMaps,
  SbbJourneyMapsModule,
  SbbMapCenterOptions,
  SbbZoomLevels,
} from '@sbb-esta/journey-maps';
import { LngLatLike } from 'maplibre-gl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps - SBB Map Navigation
 * @order 4
 * @includeExtraFiles ../shared/config.ts
 */
@Component({
  selector: 'sbb-journey-maps-map-navigation-example',
  templateUrl: 'journey-maps-map-navigation-example.html',
  styleUrls: ['journey-maps-map-navigation-example.css'],
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
  ],
})
export class JourneyMapsMapNavigationExample implements OnInit {
  apiKey = window.JM_API_KEY;
  form: UntypedFormGroup;
  @ViewChild('advancedMap')
  client: SbbJourneyMaps;
  mapCenter?: LngLatLike;
  mapBoundingBox?: number[][];
  zoomLevels?: SbbZoomLevels;
  mapBearing?: number;
  mapPitch?: number;
  mapCenterChange = new Subject<LngLatLike>();
  mapBoundingBoxChange = new Subject<number[][]>();
  interactionOptions: SbbInteractionOptions = {
    enableRotate: true,
    enablePitch: true,
  };
  viewportDimensions: SbbMapCenterOptions = {
    mapCenter: [7.44744, 46.94809],
    zoomLevel: 15,
    bearing: 540,
    pitch: 60,
  };

  ngOnInit() {
    this.subscribeMapCenterChange();
    this.subscribeMapBoxChange();
  }

  mapCenterInfo(): { lng: number; lat: number } | undefined {
    if (!this.mapCenter) {
      return;
    }
    return this.mapCenter as { lng: number; lat: number };
  }

  mapBoundingBoxInfo(): string {
    let lngSW = '',
      latSW = '',
      lngNE = '',
      latNE = '';
    if (this.mapBoundingBox) {
      lngSW = this.formatCoordinate(this.mapBoundingBox[0][0]);
      latSW = this.formatCoordinate(this.mapBoundingBox[0][1]);
      lngNE = this.formatCoordinate(this.mapBoundingBox[1][0]);
      latNE = this.formatCoordinate(this.mapBoundingBox[1][1]);
    }
    return ` ${lngSW}, ${latSW} | ${lngNE}, ${latNE}`;
  }

  private subscribeMapBoxChange() {
    this.mapBoundingBoxChange
      .pipe(takeUntil(this.destroyed))
      .subscribe((mapBoundingBox: number[][]) => (this.mapBoundingBox = mapBoundingBox));
  }

  private subscribeMapCenterChange() {
    this.mapCenterChange
      .pipe(takeUntil(this.destroyed))
      .subscribe((mapCenter: LngLatLike) => (this.mapCenter = mapCenter));
  }
  private formatCoordinate(value: number): string {
    return value.toFixed(6);
  }

  private destroyed = new Subject<void>();
}

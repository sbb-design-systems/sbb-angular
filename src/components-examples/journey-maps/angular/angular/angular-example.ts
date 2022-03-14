import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SbbCheckboxChange } from '@sbb-esta/angular/checkbox';
import {
  InteractionOptions,
  JourneyMapsClientComponent,
  JourneyMapsRoutingOptions,
  UIOptions,
  ViewportOptions,
} from '@sbb-esta/journey-maps';
import { LngLatLike } from 'maplibre-gl';
import { Subject, take } from 'rxjs';
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
export class Angular implements OnInit, OnDestroy {
  @ViewChild(JourneyMapsClientComponent)
  client: JourneyMapsClientComponent;

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
  markerOptions = markers;
  journeyMapsRoutingOption: JourneyMapsRoutingOptions;
  journeyMapsRoutingOptions = [
    'journey',
    'transfer luzern',
    'transfer zurich indoor',
    'transfer bern indoor',
    'transfer geneve indoor',
  ];
  viewportOptions: ViewportOptions = {};

  private _destroyed = new Subject<void>();

  ngOnInit() {
    this.mapCenterChange
      .pipe(takeUntil(this._destroyed))
      .subscribe((mapCenter) => (this.mapCenter = mapCenter));
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
      });
    }
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import {
  BuildingExtrusions,
  SbbInteractionOptions,
  SbbJourneyMapsModule,
  SbbMapCenterOptions,
} from '@sbb-esta/journey-maps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RAIL_COLORS, STYLE_IDS } from '../shared/config';
import { extrusionsBern } from '../shared/extrusion/bern';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps - SBB Style Options
 * @includeExtraFiles ../shared/config.ts
 * @order 3
 *  */
@Component({
  selector: 'sbb-journey-maps-style-options-example',
  templateUrl: 'journey-maps-style-options-example.html',
  styleUrls: ['journey-maps-style-options-example.css'],
  imports: [
    SbbJourneyMapsModule,
    SbbNotificationModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbOptionModule,
    SbbRadioButtonModule,
    SbbSelectModule,
    SbbFormFieldModule,
  ],
})
export class JourneyMapsStyleOptionsExample implements OnInit {
  apiKey = window.JM_API_KEY;
  form: UntypedFormGroup;
  interactionOptions: SbbInteractionOptions = {
    enableRotate: true,
    enablePitch: true,
  };
  viewportDimensions: SbbMapCenterOptions = {
    mapCenter: [7.440099, 46.948558],
    zoomLevel: 16.7,
    bearing: 290,
    pitch: 60,
  };
  customExtrusions?: BuildingExtrusions = extrusionsBern;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.subscribeStyleVersion();
    this.subscribeCustomExtrusion();
  }

  private buildForm() {
    this.form = this.fb.group({
      styleOptions: this.fb.group({
        mode: ['bright'],
        railNetwork: this.fb.group({
          railNetworkColor: [],
        }),
        ...STYLE_IDS.v2,
      }),
      styleVersion: this.fb.group({
        versionNumber: ['v2'],
      }),
      defaultExtrusions: [true],
      customExtrusions: [true],
    });
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

  private subscribeCustomExtrusion() {
    this.form
      .get('customExtrusions')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe((showCustom: boolean) => {
        this.customExtrusions = showCustom ? extrusionsBern : undefined;
      });
  }

  private readonly _destroyed = new Subject<void>();

  protected readonly RAIL_COLORS = RAIL_COLORS;
}

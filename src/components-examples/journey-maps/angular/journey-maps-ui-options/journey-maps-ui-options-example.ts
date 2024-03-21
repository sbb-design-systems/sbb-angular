import { AsyncPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbJourneyMapsModule } from '@sbb-esta/journey-maps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CH_BOUNDS } from '../shared/config';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps - SBB UI Options
 * @includeExtraFiles ../shared/config.ts,../shared/markers.ts,../shared/journey/be-sh.ts,../shared/journey/zh-be_wyleregg.ts,../shared/journey/zh-sh_waldfriedhof.ts,../shared/routes/biel-lyss.ts,../shared/routes/bn-ls.ts,../shared/transfer/bern-indoor.ts,../shared/transfer/geneve-indoor.ts,../shared/transfer/luzern4-j.ts,../shared/transfer/zurich-indoor.ts,../shared/zone/bern-burgdorf.ts,../shared/zone/bs-bl.ts
 *  */
@Component({
  selector: 'sbb-journey-maps-ui-options-example',
  templateUrl: 'journey-maps-ui-options-example.html',
  styleUrls: ['journey-maps-ui-options-example.css'],
  standalone: true,
  imports: [
    SbbJourneyMapsModule,
    SbbNotificationModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    AsyncPipe,
    DecimalPipe,
    SbbButtonModule,
    SbbInputModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbOptionModule,
    SbbRadioButtonModule,
    SbbSelectModule,
    TitleCasePipe,
  ],
})
export class JourneyMapsUiOptionsExample implements OnInit {
  apiKey = window.JM_API_KEY;
  form: UntypedFormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.subscribeLimitCHBound();
  }

  private buildForm() {
    this.form = this.fb.group({
      uiOptions: this.fb.group({
        showSmallButtons: [false],
        levelSwitch: [true],
        zoomControls: [true],
        basemapSwitch: [true],
        homeButton: [true],
        geoLocation: [false],
      }),
      limitMaxBounds: [false],
      viewportBounds: this.fb.group({
        minZoomLevel: [1],
        maxZoomLevel: [23],
        maxBounds: [],
      }),
    });
  }

  private subscribeLimitCHBound() {
    this.form
      .get('limitMaxBounds')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe((limitMaxBounds: boolean) =>
        this.form
          .get('viewportBounds.maxBounds')
          ?.patchValue(limitMaxBounds ? CH_BOUNDS : undefined),
      );
  }

  private _destroyed = new Subject<void>();
}

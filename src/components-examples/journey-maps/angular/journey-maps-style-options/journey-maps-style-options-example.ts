import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbJourneyMapsModule } from '@sbb-esta/journey-maps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RAIL_COLORS, STYLE_IDS } from '../shared/config';

declare global {
  interface Window {
    JM_API_KEY: string;
  }
}

/**
 * @title Journey Maps - SBB Style Options
 * @includeExtraFiles ../shared/config.ts,../shared/markers.ts,../shared/journey/be-sh.ts,../shared/journey/zh-be_wyleregg.ts,../shared/journey/zh-sh_waldfriedhof.ts,../shared/routes/biel-lyss.ts,../shared/routes/bn-ls.ts,../shared/transfer/bern-indoor.ts,../shared/transfer/geneve-indoor.ts,../shared/transfer/luzern4-j.ts,../shared/transfer/zurich-indoor.ts,../shared/zone/bern-burgdorf.ts,../shared/zone/bs-bl.ts
 *  */
@Component({
  selector: 'sbb-journey-maps-style-options-example',
  templateUrl: 'journey-maps-style-options-example.html',
  styleUrls: ['journey-maps-style-options-example.css'],
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
  ],
})
export class JourneyMapsStyleOptionsExample implements OnInit {
  apiKey = window.JM_API_KEY;
  form: UntypedFormGroup;
  selectedMarkerId?: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.subscribeStyleVersion();
  }

  private buildForm() {
    this.form = this.fb.group({
      styleOptions: this.fb.group({
        mode: ['bright', this.resetSelectedMarkerIdValidator],
        railNetwork: this.fb.group({
          railNetworkColor: [],
        }),
        ...STYLE_IDS.v2,
      }),
      styleVersion: this.fb.group({
        versionNumber: ['v2', this.resetSelectedMarkerIdValidator],
      }),
    });
  }

  private subscribeStyleVersion() {
    this.form
      .get('styleVersion')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe(({ versionNumber }: { versionNumber: 'v1' | 'v2' }) => {
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

  protected readonly RAIL_COLORS = RAIL_COLORS;
}

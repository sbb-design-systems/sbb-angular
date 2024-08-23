import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbJourneyMapsModule, SbbStyleOptions } from '@sbb-esta/journey-maps';
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
 * @includeExtraFiles ../shared/config.ts
 * @order 3
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
        url: ['http://127.0.0.1:8080/{styleId}.json'],
        mode: ['bright', this.resetSelectedMarkerIdValidator],
        railNetwork: this.fb.group({
          railNetworkColor: [],
        }),
        ...STYLE_IDS.v3,
      }),
      styleVersion: this.fb.group({
        versionNumber: ['v3', this.resetSelectedMarkerIdValidator],
      }),
    });
  }

  private subscribeStyleVersion() {
    this.form
      .get('styleVersion')
      ?.valueChanges.pipe(takeUntil(this._destroyed))
      .subscribe(({ versionNumber }: { versionNumber: 'v1' | 'v2' | 'v3' }) => {
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

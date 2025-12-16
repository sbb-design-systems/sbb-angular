// tslint:disable:require-property-typedef
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbOption } from '@sbb-esta/angular/core';
import { SbbFormField } from '@sbb-esta/angular/form-field';
import { SbbNotification } from '@sbb-esta/angular/notification';
import { SbbSelect } from '@sbb-esta/angular/select';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UPDATE_STEPS } from './update-steps';

@Component({
  selector: 'sbb-how-to-update',
  templateUrl: './how-to-update.component.html',
  styleUrls: ['./how-to-update.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SbbFormField,
    SbbSelect,
    SbbOption,
    SbbNotification,
    AsyncPipe,
  ],
})
export class HowToUpdateComponent {
  private _formBuilder = inject(FormBuilder);

  versions: number[] = [
    ...new Set([...UPDATE_STEPS.map((s) => s.from), ...UPDATE_STEPS.map((s) => s.to)]),
  ].sort();

  versionSelect = this._formBuilder.group({
    from: new FormControl(this.versions.slice(-2)[0], { nonNullable: true }),
    to: new FormControl(this.versions.slice(-1)[0], { nonNullable: true }),
  });

  steps = combineLatest([
    this.versionSelect.controls.from.valueChanges.pipe(
      startWith(this.versionSelect.controls.from.value),
    ),
    this.versionSelect.controls.to.valueChanges.pipe(
      startWith(this.versionSelect.controls.to.value),
    ),
  ]).pipe(map(([from, to]) => UPDATE_STEPS.filter((s) => from! <= s.from && s.to <= to!)));

  toVersionString(version: number) {
    return `${version / 100}.${version % 100}`;
  }
}

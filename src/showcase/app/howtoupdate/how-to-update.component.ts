import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { UPDATE_STEPS } from './update-steps';

@Component({
  selector: 'sbb-how-to-update',
  templateUrl: './how-to-update.component.html',
  styleUrls: ['./how-to-update.component.css'],
  standalone: false,
})
export class HowToUpdateComponent {
  private _formBuilder = inject(FormBuilder);

  versions: number[] = [
    ...new Set([...UPDATE_STEPS.map((s) => s.from), ...UPDATE_STEPS.map((s) => s.to)]),
  ].sort();

  versionSelect = this._formBuilder.group({
    from: new FormControl(this.versions.slice(-2)[0]),
    to: new FormControl(this.versions.slice(-1)[0]),
  });

  steps = combineLatest([
    this.versionSelect.controls.from.valueChanges.pipe(
      startWith(this.versionSelect.controls.from.value),
    ),
    this.versionSelect.controls.to.valueChanges.pipe(
      startWith(this.versionSelect.controls.to.value),
    ),
  ]).pipe(map(([from, to]) => UPDATE_STEPS.filter((s) => from <= s.from && s.to <= to)));

  toVersionString(version: number) {
    return `${version / 100}.${version % 100}`;
  }
}

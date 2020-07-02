import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// @ts-ignore versions.ts is generated automatically by bazel
import { libraryVersion } from '../versions';

@Component({
  selector: 'sbb-how-to-update',
  templateUrl: './how-to-update.component.html',
})
export class HowToUpdateComponent {
  libraryMajorVersion: number = +libraryVersion.split('.')[0];
  libraryPredecessorMajorVersion = this.libraryMajorVersion - 1;
  fullCommand = new FormControl(false);
}

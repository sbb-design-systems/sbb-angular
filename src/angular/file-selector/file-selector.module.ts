import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbFileSelector } from './file-selector';

@NgModule({
  declarations: [SbbFileSelector],
  imports: [CommonModule, SbbIconModule],
  exports: [SbbFileSelector],
})
export class SbbFileSelectorModule {}

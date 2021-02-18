import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbLoading } from './loading/loading';

@NgModule({
  imports: [CommonModule],
  declarations: [SbbLoading],
  exports: [SbbLoading],
})
export class SbbLoadingModule {}

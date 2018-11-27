import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingComponent } from './loading/loading.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SbbSpinnerService } from './service/sbb-spinner.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadingComponent, SpinnerComponent],
  exports: [LoadingComponent, SpinnerComponent],
  providers: [SbbSpinnerService]
})
export class LoadingModule {
}

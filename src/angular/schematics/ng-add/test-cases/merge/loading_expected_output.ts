import { Component, NgModule } from '@angular/core';
import {
  SbbLoadingIndicatorModule,
  SbbLoadingIndicator,
  SbbLoadingIndicatorModule as SbbBusinessLoadingModule,
  SbbLoadingIndicatorModule as SbbBusinessLoadingModuleSecond,
} from '@sbb-esta/angular/loading-indicator';

@Component({
  selector: 'sbb-loading-test',
  template: `<sbb-loading></sbb-loading>`,
})
export class SbbLoadingTestComponent {}

@NgModule({
  declarations: [SbbLoadingTestComponent],
  imports: [SbbLoadingIndicatorModule],
})
export class LoadingPublicTestModule {}

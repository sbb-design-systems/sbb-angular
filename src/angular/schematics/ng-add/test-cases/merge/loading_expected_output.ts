import { Component, NgModule } from '@angular/core';
import { SbbLoadingModule, SbbLoading, SbbLoadingModule as SbbBusinessLoadingModule, SbbLoadingModule as SbbBusinessLoadingModuleSecond } from '@sbb-esta/angular/loading';

@Component({
  selector: 'sbb-loading-test',
  template: `<sbb-loading></sbb-loading>`,
})
export class SbbLoadingTestComponent {}

@NgModule({
  declarations: [SbbLoadingTestComponent],
  imports: [SbbLoadingModule],
})
export class LoadingPublicTestModule {}

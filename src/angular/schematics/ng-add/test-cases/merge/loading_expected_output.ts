import { Component, NgModule } from '@angular/core';
import { SbbLoadingModule, SbbLoading } from '@sbb-esta/angular/loading';
import { SbbLoadingModule as SbbBusinessLoadingModule } from '@sbb-esta/angular/loading';
import { SbbLoadingModule as SbbBusinessLoadingModuleSecond } from '@sbb-esta/angular/loading';

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

import { Component, NgModule } from '@angular/core';
import { SbbLoadingModule, SbbLoading } from '@sbb-esta/angular-public';
import { SbbLoadingModule as SbbBusinessLoadingModule } from '@sbb-esta/angular-business/loading';
import { SbbLoadingModule as SbbBusinessLoadingModuleSecond } from '@sbb-esta/angular-business';

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

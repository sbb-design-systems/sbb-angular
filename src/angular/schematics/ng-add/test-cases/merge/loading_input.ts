import { Component, NgModule } from '@angular/core';
import { SbbLoadingModule } from '@sbb-esta/angular-public';
import { SbbLoadingModule as SbbBusinessLoadingModule } from '@sbb-esta/angular-business/loading';

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

@NgModule({
  declarations: [],
  imports: [SbbBusinessLoadingModule],
})
export class LoadingBusinessTestModule {}

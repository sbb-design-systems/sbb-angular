import { Component, NgModule } from '@angular/core';
import { SbbLoadingIndicatorModule } from '@sbb-esta/angular/loading-indicator';

@Component({
  selector: 'sbb-loading-test',
  template: '<sbb-loading-indicator></sbb-loading-indicator>',
})
export class SbbLoadingTestComponent {}

@NgModule({
  declarations: [SbbLoadingTestComponent],
  imports: [SbbLoadingIndicatorModule],
})
export class SbbLoadingTestModule {}

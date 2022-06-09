import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbLoadingIndicatorModule, SbbLoadingIndicator } from '@sbb-esta/angular/loading-indicator';

@Component({
  selector: 'sbb-loading-test',
  template: '<sbb-loading-indicator></sbb-loading-indicator>',
})
export class SbbLoadingTestComponent {
  @ViewChild(SbbLoadingIndicator) loading: SbbLoadingIndicator;
}

@NgModule({
  declarations: [SbbLoadingTestComponent],
  imports: [SbbLoadingIndicatorModule],
})
export class SbbLoadingTestModule {}

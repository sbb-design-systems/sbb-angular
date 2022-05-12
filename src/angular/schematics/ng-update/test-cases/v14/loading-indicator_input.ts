import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbLoadingModule, SbbLoading } from '@sbb-esta/angular/loading';

@Component({
  selector: 'sbb-loading-test',
  template: '<sbb-loading></sbb-loading>',
})
export class SbbLoadingTestComponent {
  @ViewChild(SbbLoading) loading: SbbLoading;
}

@NgModule({
  declarations: [SbbLoadingTestComponent],
  imports: [SbbLoadingModule],
})
export class SbbLoadingTestModule {}

import {
  SbbPageChangeEvent,
  SbbPaginationModule,
  SbbPaginatorComponent
} from '@sbb-esta/angular-public';
import { Component, NgModule } from '@angular/core';

@Component({
  template: `
    <sbb-pagination (pageChange)="changePage($event)" length="5"></sbb-pagination>`
})
export class SbbPaginationTestComponent {
  changePage($event: SbbPageChangeEvent) {
  }
}

@NgModule({
  declarations: [SbbPaginationTestComponent],
  imports: [SbbPaginationModule]
})
export class PaginationPublicTestModule {
}

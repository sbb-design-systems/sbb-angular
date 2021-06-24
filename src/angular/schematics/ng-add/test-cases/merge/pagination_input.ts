import {
  SbbPageChangeEvent,
  SbbPaginationModule,
  SbbPaginatorComponent
} from '@sbb-esta/angular-public';
import { Component, NgModule } from '@angular/core';

@Component({
  template: `
    <sbb-pagination (pageChange)="changePage($event)" length="5"></sbb-pagination>
    <sbb-pagination (pageChange)="changePage($event)" length="10"></sbb-pagination>
    <sbb-pagination (pageChange)="changePage($event)" [length]="getLength()"></sbb-pagination>
    <sbb-pagination (pageChange)="changePage($event)" [length]="pageSize" pageIndex="0"></sbb-pagination>`
})
export class SbbPaginationTestComponent {
  pageSize = 5;
  changePage($event: SbbPageChangeEvent) {
  }
  getLength() {
    return 4;
  }
}

@NgModule({
  declarations: [SbbPaginationTestComponent],
  imports: [SbbPaginationModule]
})
export class PaginationPublicTestModule {
}

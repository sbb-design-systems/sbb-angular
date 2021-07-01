import {
  SbbPageChangeEvent,
  SbbPagination,
  SbbPaginationModule,
  SbbPaginatorComponent,
} from '@sbb-esta/angular-public';
import { Component, NgModule, ViewChild } from '@angular/core';

@Component({
  template: `
    <sbb-pagination (pageChange)="changePage($event)" length="5"></sbb-pagination>
    <sbb-pagination length="10" [pageIndex]="2"></sbb-pagination>
    <sbb-pagination (pageChange)="changePage($event)" [length]="getLength()"></sbb-pagination>
    <sbb-pagination
      (pageChange)="changePage($event)"
      [length]="pageSize"
      pageIndex="0"
    ></sbb-pagination>
    <sbb-paginator
      (page)="changePage($event)"
      [pageIndex]="2"
      length="20"
      pageSize="5"
    ></sbb-paginator>
  `,
})
export class SbbPaginationTestComponent {
  @ViewChild(SbbPagination) pagination: SbbPagination;
  pageSize = 5;
  changePage($event: SbbPageChangeEvent) {}
  getLength() {
    return 4;
  }
}

@NgModule({
  declarations: [SbbPaginationTestComponent],
  imports: [SbbPaginationModule],
})
export class PaginationPublicTestModule {}

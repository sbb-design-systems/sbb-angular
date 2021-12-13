import { SbbPageEvent, SbbPaginator, SbbPaginationModule } from '@sbb-esta/angular/pagination';
import { Component, NgModule, ViewChild } from '@angular/core';

@Component({
  template: `
    <sbb-paginator
      class="app-paginator sbb-divider-small-top"
      (page)="changePage($event)"
      length="TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10"
    ></sbb-paginator>
    <sbb-paginator length="TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10" [pageIndex]="2" class="sbb-divider-small-top"></sbb-paginator>
    <sbb-paginator (page)="changePage($event)" [length]="TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10" class="sbb-divider-small-top"></sbb-paginator>
    <sbb-paginator
      (page)="changePage($event)"
      [length]="TODO: Change according to documentation. Most likely the value is the current length multiplied by the pageSize." pageSize="10"
      pageIndex="0"
     class="sbb-divider-small-top"></sbb-paginator>
    <sbb-paginator
      (page)="changePage($event)"
      [pageIndex]="2"
      length="20"
      pageSize="5"
     class="sbb-divider-small-top"></sbb-paginator>
  `,
})
export class SbbPaginationTestComponent {
  @ViewChild(SbbPaginator) pagination: SbbPaginator;
  pageSize = 5;
  changePage($event: SbbPageEvent) {}
  getLength() {
    return 4;
  }
}

@NgModule({
  declarations: [SbbPaginationTestComponent],
  imports: [SbbPaginationModule],
})
export class PaginationPublicTestModule {}

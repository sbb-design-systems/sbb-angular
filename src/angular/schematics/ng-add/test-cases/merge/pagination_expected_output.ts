import { SbbPageEvent, SbbPaginationModule, SbbPaginator } from '@sbb-esta/angular/pagination';
import { Component, NgModule } from '@angular/core';

@Component({
  template: `
    <sbb-paginator (page)="changePage($event)" length="TODO: Change according to documentation" pageSize="10"></sbb-paginator>`
})
export class SbbPaginationTestComponent {
  changePage($event: SbbPageEvent) {
  }
}

@NgModule({
  declarations: [SbbPaginationTestComponent],
  imports: [SbbPaginationModule]
})
export class PaginationPublicTestModule {
}

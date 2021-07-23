import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbPaginationModule } from '@sbb-esta/angular/pagination';

import { NavigationExample } from './navigation/navigation-example';
import { PaginatorExample } from './paginator/paginator-example';

export { NavigationExample, PaginatorExample };

const EXAMPLES = [NavigationExample, PaginatorExample];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbInputModule,
    SbbPaginationModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class PaginationExamplesModule {}

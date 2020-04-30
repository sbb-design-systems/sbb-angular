import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { PaginationModule } from '@sbb-esta/angular-business/pagination';

import { NavigationExampleComponent } from './navigation-example/navigation-example.component';
import { PaginatorExampleComponent } from './paginator-example/paginator-example.component';

const EXAMPLES = [PaginatorExampleComponent, NavigationExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldModule,
    PaginationModule,
    ButtonModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class PaginationExamplesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { PaginationModule } from '@sbb-esta/angular-business/pagination';

import { PaginationExampleComponent } from './pagination-example/pagination-example.component';

const EXAMPLES = [PaginationExampleComponent];

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

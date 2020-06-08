import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { PaginationModule } from '@sbb-esta/angular-public/pagination';

import { provideExamples } from '../../../shared/example-provider';

import { NavigationExampleComponent } from './navigation-example/navigation-example.component';
import { PaginatorExampleComponent } from './paginator-example/paginator-example.component';

const EXAMPLES = [NavigationExampleComponent, PaginatorExampleComponent];

const EXAMPLE_INDEX = {
  'navigation-example': NavigationExampleComponent,
  'paginator-example': PaginatorExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    FieldModule,
    PaginationModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'pagination', EXAMPLE_INDEX)],
})
export class PaginationExamplesModule {}

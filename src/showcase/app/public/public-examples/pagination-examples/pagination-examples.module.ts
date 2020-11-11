import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbPaginationModule } from '@sbb-esta/angular-public/pagination';

import { provideExamples } from '../../../shared/example-provider';

import { NavigationExampleComponent } from './navigation-example/navigation-example.component';
import { PaginatorExampleComponent } from './paginator-example/paginator-example.component';

const EXAMPLES = [NavigationExampleComponent, PaginatorExampleComponent];

const EXAMPLE_INDEX = {
  'paginator-example': PaginatorExampleComponent,
  'navigation-example': NavigationExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbFormFieldModule,
    SbbPaginationModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'pagination', EXAMPLE_INDEX)],
})
export class PaginationExamplesModule {}

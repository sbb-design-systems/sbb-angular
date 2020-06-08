import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { provideExamples } from '../../../shared/example-provider';

import { PeopleListComponent } from './tabs-example/people-list/people-list.component';
import { TabsExampleComponent } from './tabs-example/tabs-example.component';

const EXAMPLES = [PeopleListComponent, TabsExampleComponent];

const EXAMPLE_INDEX = {
  'people-list': PeopleListComponent,
  'tabs-example': TabsExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    FieldModule,
    TabsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'tabs', EXAMPLE_INDEX)],
})
export class TabsExamplesModule {}

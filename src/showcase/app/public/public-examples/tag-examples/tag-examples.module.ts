import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbTagModule } from '@sbb-esta/angular-public/tag';

import { provideExamples } from '../../../shared/example-provider';

import { TagAdvancedExample } from './tag-advanced-example/tag-advanced-example.component';
import { TagLinkExample } from './tag-link-example/tag-link-example.component';
import { TagReactiveFormsExample } from './tag-reactive-forms-example/tag-reactive-forms-example.component';
import { TagTemplateFormsExampleComponent } from './tag-template-forms-example/tag-template-forms-example.component';

const EXAMPLES = [
  TagReactiveFormsExample,
  TagTemplateFormsExampleComponent,
  TagAdvancedExample,
  TagLinkExample,
];

const EXAMPLE_INDEX = {
  'tag-reactive-forms-example': TagReactiveFormsExample,
  'tag-template-forms-example': TagTemplateFormsExampleComponent,
  'tag-advanced-example': TagAdvancedExample,
  'tag-link-example': TagLinkExample,
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbFormFieldModule,
    SbbTagModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'tag', EXAMPLE_INDEX)],
})
export class TagExamplesModule {}

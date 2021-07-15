import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbTagModule } from '@sbb-esta/angular/tag';

import { TagAdvancedExample } from './tag-advanced/tag-advanced-example';
import { TagLinkExample } from './tag-link/tag-link-example';
import { TagReactiveFormsExample } from './tag-reactive-forms/tag-reactive-forms-example';
import { TagTemplateFormsExample } from './tag-template-forms/tag-template-forms-example';

export { TagReactiveFormsExample, TagTemplateFormsExample, TagAdvancedExample, TagLinkExample };

const EXAMPLES = [
  TagReactiveFormsExample,
  TagTemplateFormsExample,
  TagAdvancedExample,
  TagLinkExample,
];

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
})
export class TagExamplesModule {}

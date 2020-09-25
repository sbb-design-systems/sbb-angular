import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbFieldModule } from '@sbb-esta/angular-public/field';
import { SbbTagModule } from '@sbb-esta/angular-public/tag';

import { provideExamples } from '../../../shared/example-provider';

import { TagExampleComponent } from './tag-example/tag-example.component';

const EXAMPLES = [TagExampleComponent];

const EXAMPLE_INDEX = {
  'tag-example': TagExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbFieldModule,
    SbbTagModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'tag', EXAMPLE_INDEX)],
})
export class TagExamplesModule {}

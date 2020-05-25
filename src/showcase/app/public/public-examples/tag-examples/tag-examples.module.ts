import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { TagModule } from '@sbb-esta/angular-public/tag';

import { TagExampleComponent } from './tag-example/tag-example.component';

const EXAMPLES = [TagExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FieldModule,
    TagModule,
    ButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TagExamplesModule {}

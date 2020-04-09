import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { LinksModule } from '@sbb-esta/angular-public/links';

import { LinksExampleComponent } from './links-example/links-example.component';

const EXAMPLES = [LinksExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldModule, LinksModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class LinksExamplesModule {}

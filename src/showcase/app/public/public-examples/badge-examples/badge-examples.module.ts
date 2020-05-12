import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule } from '@sbb-esta/angular-public/badge';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';

import { BadgeExampleComponent } from './badge-example/badge-example.component';

const EXAMPLES = [BadgeExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BadgeModule, CheckboxModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class BadgeExamplesModule {}

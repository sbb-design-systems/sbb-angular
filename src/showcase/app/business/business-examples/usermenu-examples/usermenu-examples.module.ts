import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbDropdownModule } from '@sbb-esta/angular-business/dropdown';
import { SbbUsermenuModule } from '@sbb-esta/angular-business/usermenu';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { provideExamples } from '../../../shared/example-provider';

import { UsermenuExampleComponent } from './usermenu-example/usermenu-example.component';

const EXAMPLES = [UsermenuExampleComponent];

const EXAMPLE_INDEX = {
  'usermenu-example': UsermenuExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, SbbDropdownModule, SbbUsermenuModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'usermenu', EXAMPLE_INDEX)],
})
export class UsermenuExamplesModule {}

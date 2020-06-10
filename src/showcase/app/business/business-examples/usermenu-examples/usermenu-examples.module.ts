import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';
import { UsermenuModule } from '@sbb-esta/angular-business/usermenu';

import { provideExamples } from '../../../shared/example-provider';

import { UsermenuExampleComponent } from './usermenu-example/usermenu-example.component';

const EXAMPLES = [UsermenuExampleComponent];

const EXAMPLE_INDEX = {
  'usermenu-example': UsermenuExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, DropdownModule, UsermenuModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'usermenu', EXAMPLE_INDEX)],
})
export class UsermenuExamplesModule {}

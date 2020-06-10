import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';
import { UsermenuModule } from '@sbb-esta/angular-public/usermenu';

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
  providers: [provideExamples('public', 'usermenu', EXAMPLE_INDEX)],
})
export class UsermenuExamplesModule {}

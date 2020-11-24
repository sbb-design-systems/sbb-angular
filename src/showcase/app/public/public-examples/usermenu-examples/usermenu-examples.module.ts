import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbUsermenuModule } from '@sbb-esta/angular-public/usermenu';

import { provideExamples } from '../../../shared/example-provider';

import { UsermenuCustomIconExampleComponent } from './usermenu-custom-icon-example/usermenu-custom-icon-example.component';
import { UsermenuCustomImageExampleComponent } from './usermenu-custom-image-example/usermenu-custom-image-example.component';
import { UsermenuDisplayNameAndUserNameExampleComponent } from './usermenu-display-name-and-user-name-example/usermenu-display-name-and-user-name-example.component';
import { UsermenuDisplayNameExampleComponent } from './usermenu-display-name-example/usermenu-display-name-example.component';
import { UsermenuUserNameExampleComponent } from './usermenu-user-name-example/usermenu-user-name-example.component';

const EXAMPLES = [
  UsermenuCustomImageExampleComponent,
  UsermenuCustomIconExampleComponent,
  UsermenuUserNameExampleComponent,
  UsermenuDisplayNameExampleComponent,
  UsermenuDisplayNameAndUserNameExampleComponent,
];

const EXAMPLE_INDEX = {
  'usermenu-user-name-example': UsermenuUserNameExampleComponent,
  'usermenu-display-name-example': UsermenuDisplayNameExampleComponent,
  'usermenu-display-name-and-user-name-example': UsermenuDisplayNameAndUserNameExampleComponent,
  'usermenu-custom-icon-example': UsermenuCustomIconExampleComponent,
  'usermenu-custom-image-example': UsermenuCustomImageExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, SbbUsermenuModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'usermenu', EXAMPLE_INDEX)],
})
export class UsermenuExamplesModule {}

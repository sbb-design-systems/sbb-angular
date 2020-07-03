import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { GhettoboxModule } from '@sbb-esta/angular-public/ghettobox';

import { provideExamples } from '../../../shared/example-provider';

import { GhettoboxExampleComponent } from './ghettobox-example/ghettobox-example.component';

const EXAMPLES = [GhettoboxExampleComponent];

const EXAMPLE_INDEX = {
  'ghettobox-example': GhettoboxExampleComponent,
};

@NgModule({
  imports: [CommonModule, RouterModule, ButtonModule, GhettoboxModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'ghettobox', EXAMPLE_INDEX)],
})
export class GhettoboxExamplesModule {}

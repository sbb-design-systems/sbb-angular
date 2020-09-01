import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { provideExamples } from '../../../shared/example-provider';

import { IconExampleComponent } from './icon-example/icon-example.component';
import { IconFitExampleComponent } from './icon-fit-example/icon-fit-example.component';

const EXAMPLES = [IconExampleComponent, IconFitExampleComponent];

const EXAMPLE_INDEX = {
  'icon-example': IconExampleComponent,
  'icon-fit-example': IconFitExampleComponent,
};

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('core', 'icon', EXAMPLE_INDEX)],
})
export class IconExamplesModule {}

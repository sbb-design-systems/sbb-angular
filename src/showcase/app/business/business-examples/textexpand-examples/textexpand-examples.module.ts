import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextexpandModule } from '@sbb-esta/angular-business/textexpand';

import { provideExamples } from '../../../shared/example-provider';

import { TextexpandExampleComponent } from './textexpand-example/textexpand-example.component';

const EXAMPLES = [TextexpandExampleComponent];

const EXAMPLE_INDEX = {
  'textexpand-example': TextexpandExampleComponent,
};

@NgModule({
  imports: [CommonModule, TextexpandModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'textexpand', EXAMPLE_INDEX)],
})
export class TextexpandExamplesModule {}

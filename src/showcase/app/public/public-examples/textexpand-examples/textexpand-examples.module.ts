import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextexpandModule } from '@sbb-esta/angular-public/textexpand';

import { TextexpandExampleComponent } from './textexpand-example/textexpand-example.component';

const EXAMPLES = [TextexpandExampleComponent];

@NgModule({
  imports: [CommonModule, TextexpandModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TextexpandExamplesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbTextexpandModule } from '@sbb-esta/angular/textexpand';

import { TextexpandExample } from './textexpand/textexpand-example';

export { TextexpandExample };

const EXAMPLES = [TextexpandExample];

@NgModule({
  imports: [CommonModule, SbbTextexpandModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TextexpandExamplesModule {}

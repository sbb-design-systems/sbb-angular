import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BasicExample } from './basic/basic-example';

export { BasicExample };

const EXAMPLES = [BasicExample];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...EXAMPLES],
  exports: EXAMPLES,
})
export class AccordionExamplesModule {}

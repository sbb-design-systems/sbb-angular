import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderModule } from '@sbb-esta/angular-business';
import { ProcessflowModule } from '@sbb-esta/angular-business';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';

import { ProcessflowShowcaseComponent } from './processflow-showcase/processflow-showcase.component';

const exampleComponents = [ProcessflowShowcaseComponent];

@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
  imports: [CommonModule, ButtonModule, CheckboxModule, HeaderModule, ProcessflowModule]
})
export class ExamplesModule {}

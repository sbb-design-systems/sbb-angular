import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipShowcaseComponent } from './tooltip-showcase/tooltip-showcase.component';
import { TooltipModule } from '@sbb-esta/angular-business';

const exampleComponents = [TooltipShowcaseComponent];
@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
  imports: [CommonModule, TooltipModule]
})
export class ExamplesModule {}

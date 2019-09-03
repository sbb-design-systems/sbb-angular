import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContextmenuShowcaseComponent } from './contextmenu-showcase/contextmenu-showcase.component';
import { ContextmenuModule } from '@sbb-esta/angular-business';
import { DropdownModule } from '@sbb-esta/angular-public';

const exampleComponents = [ContextmenuShowcaseComponent];

@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
  imports: [CommonModule, ContextmenuModule, DropdownModule]
})
export class ExamplesModule {}

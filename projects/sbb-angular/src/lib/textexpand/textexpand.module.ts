import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from '../button/button.module';

import { TextexpandCollapsedComponent } from './textexpand-collapsed/textexpand-collapsed.component';
import { TextexpandExpandedComponent } from './textexpand-expanded/textexpand-expanded.component';
import { TextexpandComponent } from './textexpand/textexpand.component';

@NgModule({
  imports: [CommonModule, ButtonModule],
  declarations: [
    TextexpandComponent,
    TextexpandCollapsedComponent,
    TextexpandExpandedComponent
  ],
  exports: [
    TextexpandComponent,
    TextexpandCollapsedComponent,
    TextexpandExpandedComponent
  ]
})
export class TextexpandModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextexpandComponent } from './textexpand/textexpand.component';
import { TextexpandCollapsedComponent } from './textexpand-collapsed/textexpand-collapsed.component';
import { TextexpandExpandedComponent } from './textexpand-expanded/textexpand-expanded.component';
import { ButtonModule } from '../button/button.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule
  ],
  declarations: [TextexpandComponent, TextexpandCollapsedComponent, TextexpandExpandedComponent],
  exports: [TextexpandComponent, TextexpandCollapsedComponent, TextexpandExpandedComponent]
})
export class TextexpandModule { }

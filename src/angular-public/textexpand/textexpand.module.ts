import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextexpandCollapsedComponent } from './textexpand-collapsed/textexpand-collapsed.component';
import { TextexpandExpandedComponent } from './textexpand-expanded/textexpand-expanded.component';
import { TextexpandComponent } from './textexpand/textexpand.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TextexpandComponent, TextexpandCollapsedComponent, TextexpandExpandedComponent],
  exports: [TextexpandComponent, TextexpandCollapsedComponent, TextexpandExpandedComponent]
})
export class TextexpandModule {}

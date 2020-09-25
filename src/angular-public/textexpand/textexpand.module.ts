import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbTextexpandCollapsed } from './textexpand-collapsed/textexpand-collapsed.component';
import { SbbTextexpandExpanded } from './textexpand-expanded/textexpand-expanded.component';
import { SbbTextexpand } from './textexpand/textexpand.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SbbTextexpand, SbbTextexpandCollapsed, SbbTextexpandExpanded],
  exports: [SbbTextexpand, SbbTextexpandCollapsed, SbbTextexpandExpanded],
})
export class SbbTextexpandModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbTextexpand } from './textexpand';
import { SbbTextexpandCollapsed } from './textexpand-collapsed';
import { SbbTextexpandExpanded } from './textexpand-expanded';

@NgModule({
  imports: [CommonModule, SbbCommonModule],
  declarations: [SbbTextexpand, SbbTextexpandCollapsed, SbbTextexpandExpanded],
  exports: [SbbTextexpand, SbbTextexpandCollapsed, SbbTextexpandExpanded],
})
export class SbbTextexpandModule {}

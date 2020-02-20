import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PsComponentScrollable, PsDirectiveScrollable } from './ps-scrollable.directive';

/**
 * @deprecated Use native scrollbar or css class .sbb-scrollbar instead.
 */
@NgModule({
  declarations: [PsComponentScrollable, PsDirectiveScrollable],
  exports: [PerfectScrollbarModule, PsComponentScrollable, PsDirectiveScrollable],
  imports: [PerfectScrollbarModule]
})
export class ScrollingModule {}

import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PsComponentScrollable, PsDirectiveScrollable } from './ps-scrollable.directive';

@NgModule({
  declarations: [PsComponentScrollable, PsDirectiveScrollable],
  exports: [PerfectScrollbarModule, PsComponentScrollable, PsDirectiveScrollable],
  imports: [PerfectScrollbarModule]
})
export class ScrollingModule {}

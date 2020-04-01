import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PerfectScrollbarComponent } from './perfect-scrollbar.component';
import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { PsComponentScrollable, PsDirectiveScrollable } from './ps-scrollable.directive';

/**
 * @deprecated Use native scrollbar or css class .sbb-scrollbar instead.
 */
@NgModule({
  declarations: [
    PerfectScrollbarComponent,
    PerfectScrollbarDirective,
    PsComponentScrollable,
    PsDirectiveScrollable
  ],
  exports: [
    PerfectScrollbarComponent,
    PerfectScrollbarDirective,
    PsComponentScrollable,
    PsDirectiveScrollable
  ],
  imports: [CommonModule]
})
export class ScrollingModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbBadge } from './badge/badge.component';

@NgModule({
  declarations: [SbbBadge],
  imports: [CommonModule],
  exports: [SbbBadge],
})
export class SbbBadgeModule {}

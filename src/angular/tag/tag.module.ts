import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';

import { SbbTag } from './tag';
import { SbbTags } from './tags';

@NgModule({
  imports: [CommonModule, SbbBadgeModule],
  declarations: [SbbTag, SbbTags],
  exports: [SbbTag, SbbTags],
})
export class SbbTagModule {}

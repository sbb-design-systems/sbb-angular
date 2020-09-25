import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular-public/badge';

import { SbbTag } from './tag/tag.component';
import { SbbTags } from './tags/tags.component';

@NgModule({
  imports: [CommonModule, SbbBadgeModule],
  declarations: [SbbTag, SbbTags],
  exports: [SbbTag, SbbTags],
})
export class SbbTagModule {}

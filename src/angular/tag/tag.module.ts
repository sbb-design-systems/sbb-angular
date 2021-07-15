import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';

import { SbbTag } from './tag';
import { SbbTagLink } from './tag-link';
import { SbbTags } from './tags';

@NgModule({
  imports: [CommonModule, SbbBadgeModule],
  declarations: [SbbTag, SbbTags, SbbTagLink],
  exports: [SbbTag, SbbTags, SbbTagLink],
})
export class SbbTagModule {}

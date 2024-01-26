import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbTag } from './tag';
import { SbbTagLink } from './tag-link';
import { SbbTags } from './tags';

@NgModule({
  imports: [CommonModule, SbbCommonModule, SbbBadgeModule, SbbTag, SbbTags, SbbTagLink],
  exports: [SbbTag, SbbTags, SbbTagLink],
})
export class SbbTagModule {}

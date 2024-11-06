import { NgModule } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbTag } from './tag';
import { SbbTagLink } from './tag-link';
import { SbbTags } from './tags';

@NgModule({
  imports: [SbbCommonModule, SbbBadgeModule, SbbTag, SbbTags, SbbTagLink],
  exports: [SbbTag, SbbTags, SbbTagLink],
})
export class SbbTagModule {}

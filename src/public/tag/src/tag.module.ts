import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BadgeModule } from '@sbb-esta/angular-public/badge';

import { TagComponent } from './tag/tag.component';
import { TagsComponent } from './tags/tags.component';

@NgModule({
  imports: [CommonModule, BadgeModule],
  declarations: [TagComponent, TagsComponent],
  exports: [TagComponent, TagsComponent]
})
export class TagModule {}

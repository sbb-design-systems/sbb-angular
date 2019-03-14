import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { TagsComponent } from './tags/tags.component';
import { BadgeModule } from '../badge/badge';

@NgModule({
  imports: [
    CommonModule,
    BadgeModule
  ],
  declarations: [
    TagComponent,
    TagsComponent
  ],
  exports: [
    TagComponent,
    TagsComponent
  ]
})
export class TagModule { }

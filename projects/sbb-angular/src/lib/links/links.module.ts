import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  IconArrowDownModule,
  IconDownloadModule,
  IconFacebookModule,
  IconGoogleplusModule,
  IconInstagramModule,
  IconLinkedinModule,
  IconPinterestModule,
  IconTwitterModule,
  IconXingModule,
  IconYoutubeModule,
} from '../svg-icons/svg-icons';
import { LinkComponent } from './link/link.component';
import { SocialLinkComponent } from './social-link/social-link.component';

@NgModule({
  imports: [
    CommonModule,
    IconArrowDownModule,
    IconDownloadModule,
    IconFacebookModule,
    IconGoogleplusModule,
    IconInstagramModule,
    IconPinterestModule,
    IconTwitterModule,
    IconYoutubeModule,
    IconXingModule,
    IconLinkedinModule,
  ],
  declarations: [
    LinkComponent,
    SocialLinkComponent
  ],
  exports: [
    LinkComponent,
    SocialLinkComponent
  ]
})
export class LinksModule { }

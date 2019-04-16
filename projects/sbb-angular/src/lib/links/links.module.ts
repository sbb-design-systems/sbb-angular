import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  IconArrowRightModule,
  IconDownloadModule,
  IconFacebookModule,
  IconGoogleplusModule,
  IconInstagramModule,
  IconLinkedinModule,
  IconPinterestModule,
  IconTwitterModule,
  IconXingModule,
  IconYoutubeModule,
} from 'sbb-angular-icons';
import { LinkComponent } from './link/link.component';
import { SocialLinkComponent } from './social-link/social-link.component';

@NgModule({
  imports: [
    CommonModule,
    IconArrowRightModule,
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

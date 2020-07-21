import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import {
  IconFacebookModule,
  IconInstagramModule,
  IconLinkedinModule,
  IconPinterestModule,
  IconTwitterModule,
  IconXingModule,
  IconYoutubeModule,
} from '@sbb-esta/angular-icons/social-media';

import { LinkComponent } from './link/link.component';
import { SocialLinkComponent } from './social-link/social-link.component';

@NgModule({
  imports: [
    CommonModule,
    SbbIconModule,
    IconFacebookModule,
    IconInstagramModule,
    IconPinterestModule,
    IconTwitterModule,
    IconYoutubeModule,
    IconXingModule,
    IconLinkedinModule,
  ],
  declarations: [LinkComponent, SocialLinkComponent],
  exports: [LinkComponent, SocialLinkComponent],
})
export class LinksModule {}

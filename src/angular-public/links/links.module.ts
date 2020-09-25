import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import {
  IconFacebookModule,
  IconInstagramModule,
  IconLinkedinModule,
  IconPinterestModule,
  IconTwitterModule,
  IconXingModule,
  IconYoutubeModule,
} from '@sbb-esta/angular-icons/social-media';

import { SbbLink } from './link/link.component';
import { SbbSocialLink } from './social-link/social-link.component';

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
  declarations: [SbbLink, SbbSocialLink],
  exports: [SbbLink, SbbSocialLink],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbLinksModule {}

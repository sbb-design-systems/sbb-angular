import { NgModule } from '@angular/core';

import { IconFacebookModule } from './icon-facebook.module';
import { IconInstagramModule } from './icon-instagram.module';
import { IconLinkedinModule } from './icon-linkedin.module';
import { IconPinterestModule } from './icon-pinterest.module';
import { IconTwitterModule } from './icon-twitter.module';
import { IconXingModule } from './icon-xing.module';
import { IconYoutubeModule } from './icon-youtube.module';

const modules = [
  IconTwitterModule,
  IconFacebookModule,
  IconInstagramModule,
  IconYoutubeModule,
  IconLinkedinModule,
  IconPinterestModule,
  IconXingModule,
];

/**
 * @Deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: modules,
  exports: modules,
})
export class IconCollectionSocialMediaModule {}

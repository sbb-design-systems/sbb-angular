import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconCommonModule } from '../svg-icons-components/icon-common.module';

import { LinkComponent } from './link/link.component';
import { SocialLinkComponent } from './social-link/social-link.component';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule
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

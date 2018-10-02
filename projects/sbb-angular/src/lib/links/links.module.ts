import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconCommonModule } from '../svg-icons-components';

import { IconLinkComponent } from './icon-link/icon-link.component';
import { SocialLinkComponent } from './social-link/social-link.component';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule
  ],
  declarations: [
    IconLinkComponent,
    SocialLinkComponent
  ]
})
export class LinksModule { }

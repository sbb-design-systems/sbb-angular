import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { LinksModule } from '@sbb-esta/angular-public/links';

import { IconLinkExampleComponent } from './icon-link-example/icon-link-example.component';
import { SocialLinkExampleComponent } from './social-link-example/social-link-example.component';

const EXAMPLES = [IconLinkExampleComponent, SocialLinkExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldModule, LinksModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class LinksExamplesModule {}

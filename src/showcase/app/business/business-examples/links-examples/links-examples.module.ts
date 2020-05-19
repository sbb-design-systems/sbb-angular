import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { LinksModule } from '@sbb-esta/angular-business/links';

import { IconLinkExampleComponent } from './icon-link-example/icon-link-example.component';
import { SimpleLinkExampleComponent } from './simple-link-example/simple-link-example.component';

const EXAMPLES = [IconLinkExampleComponent, SimpleLinkExampleComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldModule, LinksModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class LinksExamplesModule {}

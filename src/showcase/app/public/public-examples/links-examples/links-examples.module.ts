import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbFieldModule } from '@sbb-esta/angular-public/field';
import { SbbLinksModule } from '@sbb-esta/angular-public/links';

import { provideExamples } from '../../../shared/example-provider';

import { IconLinkExampleComponent } from './icon-link-example/icon-link-example.component';

const EXAMPLES = [IconLinkExampleComponent];

const EXAMPLE_INDEX = {
  'icon-link-example': IconLinkExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SbbFieldModule, SbbLinksModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'links', EXAMPLE_INDEX)],
})
export class LinksExamplesModule {}

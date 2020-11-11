import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular-business/form-field';
import { SbbLinksModule } from '@sbb-esta/angular-business/links';

import { provideExamples } from '../../../shared/example-provider';

import { IconLinkExampleComponent } from './icon-link-example/icon-link-example.component';
import { SimpleLinkExampleComponent } from './simple-link-example/simple-link-example.component';

const EXAMPLES = [IconLinkExampleComponent, SimpleLinkExampleComponent];

const EXAMPLE_INDEX = {
  'simple-link-example': SimpleLinkExampleComponent,
  'icon-link-example': IconLinkExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SbbFormFieldModule, SbbLinksModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'links', EXAMPLE_INDEX)],
})
export class LinksExamplesModule {}

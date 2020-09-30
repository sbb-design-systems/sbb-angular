import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbFieldModule } from '@sbb-esta/angular-public/field';
import { SbbLightboxModule } from '@sbb-esta/angular-public/lightbox';
import { SbbRadioButtonModule } from '@sbb-esta/angular-public/radio-button';

import { provideExamples } from '../../../shared/example-provider';

import {
  LightboxExampleComponent,
  LightboxExampleExample2Component,
  LightboxExampleExample2ContentComponent,
  LightboxExampleExample3Component,
  LightboxExampleExample4Component,
  LightboxExampleExample4ContentComponent,
  LightboxExampleExample5Component,
  LightboxExampleExample5ContentComponent,
  LightboxExampleExample6ContentComponent,
  LightboxExampleExampleComponent,
  LightboxExampleExampleContentComponent,
} from './lightbox-example/lightbox-example.component';

const EXAMPLES = [
  LightboxExampleComponent,
  LightboxExampleExample2Component,
  LightboxExampleExample2ContentComponent,
  LightboxExampleExample3Component,
  LightboxExampleExample4Component,
  LightboxExampleExample4ContentComponent,
  LightboxExampleExample5Component,
  LightboxExampleExample5ContentComponent,
  LightboxExampleExample6ContentComponent,
  LightboxExampleExampleComponent,
  LightboxExampleExampleContentComponent,
];

const EXAMPLE_INDEX = {
  'lightbox-example': LightboxExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbButtonModule,
    SbbFieldModule,
    SbbLightboxModule,
    SbbRadioButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'lightbox', EXAMPLE_INDEX)],
})
export class LightboxExamplesModule {}

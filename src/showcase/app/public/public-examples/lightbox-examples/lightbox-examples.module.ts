import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { LightboxModule } from '@sbb-esta/angular-public/lightbox';
import { RadioButtonModule } from '@sbb-esta/angular-public/radio-button';

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
    ButtonModule,
    FieldModule,
    LightboxModule,
    RadioButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'lightbox', EXAMPLE_INDEX)],
})
export class LightboxExamplesModule {}

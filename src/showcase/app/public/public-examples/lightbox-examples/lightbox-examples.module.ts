import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { IconCrossModule } from '@sbb-esta/angular-icons/navigation';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { LightboxModule } from '@sbb-esta/angular-public/lightbox';
import { RadioButtonModule } from '@sbb-esta/angular-public/radio-button';

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
  LightboxExampleExampleContentComponent
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
  LightboxExampleExampleContentComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconArrowRightModule,
    IconCrossModule,
    FieldModule,
    LightboxModule,
    RadioButtonModule,
    ButtonModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class LightboxExamplesModule {}

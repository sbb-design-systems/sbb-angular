import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { IconDownloadModule } from '@sbb-esta/angular-icons/basic';
import { IconPlusModule } from '@sbb-esta/angular-icons/navigation';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';

import { ButtonExampleComponent } from './button-example/button-example.component';

const EXAMPLES = [ButtonExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconArrowRightModule,
    IconDownloadModule,
    IconPlusModule,
    ButtonModule,
    CheckboxModule,
    FieldModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class ButtonExamplesModule {}

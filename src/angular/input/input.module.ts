import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';

import { SbbInput } from './input';

@NgModule({
  declarations: [SbbInput],
  imports: [TextFieldModule, SbbCommonModule, SbbFormFieldModule],
  exports: [
    TextFieldModule,
    // We re-export the `SbbFormFieldModule` since `SbbInput` will almost always
    // be used together with `SbbFormField`.
    SbbFormFieldModule,
    SbbInput,
  ],
})
export class SbbInputModule {}

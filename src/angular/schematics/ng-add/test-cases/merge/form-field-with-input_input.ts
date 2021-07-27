import { NgModule } from '@angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbInputModule } from '@sbb-esta/angular-public/input';
import { SbbFormFieldControl } from '@sbb-esta/angular-core/forms';

@NgModule({
  imports: [SbbFormFieldModule, SbbInputModule],
})
export class FormFieldModule {}

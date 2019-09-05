import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconCrossModule } from '@sbb-esta/angular-icons';

import { ClearInputTargetDirective } from './clear-input.target.directive';
import { ClearInputComponent } from './clear-input/clear-input.component';

@NgModule({
  declarations: [ClearInputComponent, ClearInputTargetDirective],
  imports: [CommonModule, IconCrossModule],
  exports: [ClearInputComponent, ClearInputTargetDirective]
})
export class ClearInputModule {}

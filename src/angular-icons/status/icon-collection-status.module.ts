import { NgModule } from '@angular/core';

import { IconButtonPowerModule } from './icon-button-power.module';
import { IconExclamationPointModule } from './icon-exclamation-point.module';
import { IconEyeDisabledModule } from './icon-eye-disabled.module';
import { IconEyeModule } from './icon-eye.module';
import { IconLockClosedModule } from './icon-lock-closed.module';
import { IconLockOpenModule } from './icon-lock-open.module';
import { IconQuestionMarkModule } from './icon-question-mark.module';
import { IconTickClipboardModule } from './icon-tick-clipboard.module';
import { IconTickModule } from './icon-tick.module';

const modules = [
  IconButtonPowerModule,
  IconExclamationPointModule,
  IconEyeModule,
  IconEyeDisabledModule,
  IconLockClosedModule,
  IconLockOpenModule,
  IconQuestionMarkModule,
  IconTickModule,
  IconTickClipboardModule,
];

/**
 * @Deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: modules,
  exports: modules,
})
export class IconCollectionStatusModule {}

import { NgModule } from '@angular/core';

import { SbbCommonModule } from '../common-behaviors/common.module';

import { SbbOptgroup } from './optgroup';
import { SbbOption } from './option';
import { SbbOptionHint } from './option-hint';
import { SbbPseudoCheckbox } from './pseudo-checkbox';

@NgModule({
  imports: [SbbCommonModule],
  declarations: [SbbOption, SbbOptionHint, SbbOptgroup, SbbPseudoCheckbox],
  exports: [SbbOption, SbbOptionHint, SbbOptgroup, SbbPseudoCheckbox],
})
export class SbbOptionModule {}

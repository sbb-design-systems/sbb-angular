import { NgModule } from '@angular/core';

import { PsChromePatchDirective } from './ps-chrome-patch.directive';

@NgModule({
  declarations: [PsChromePatchDirective],
  exports: [PsChromePatchDirective]
})
export class PsChromePatchModule {}

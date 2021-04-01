import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbStatusModule } from '@sbb-esta/angular/status';

import { StatusWithMessageExample } from './status-with-message/status-with-message-example';
import { StatusExample } from './status/status-example';

export { StatusExample, StatusWithMessageExample };

const EXAMPLES = [StatusExample, StatusWithMessageExample];

@NgModule({
  imports: [CommonModule, SbbStatusModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class StatusExamplesModule {}

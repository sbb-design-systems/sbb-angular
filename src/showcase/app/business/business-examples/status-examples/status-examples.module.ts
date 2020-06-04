import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatusModule } from '@sbb-esta/angular-business/status';
import { IconCloudModule } from '@sbb-esta/angular-icons/weather';

import { StatusCustomIconExampleComponent } from './status-custom-icon-example/status-custom-icon-example.component';
import { StatusExampleComponent } from './status-example/status-example.component';
import { StatusWithMessageExampleComponent } from './status-with-message-example/status-with-message-example.component';

const EXAMPLES = [
  StatusCustomIconExampleComponent,
  StatusExampleComponent,
  StatusWithMessageExampleComponent,
];

@NgModule({
  imports: [CommonModule, StatusModule, IconCloudModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class StatusExamplesModule {}

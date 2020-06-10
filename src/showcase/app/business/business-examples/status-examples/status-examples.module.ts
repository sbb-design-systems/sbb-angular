import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatusModule } from '@sbb-esta/angular-business/status';
import { IconCloudModule } from '@sbb-esta/angular-icons/weather';

import { StatusExampleComponent } from './status-example/status-example.component';
import { StatusWithMessageExampleComponent } from './status-with-message-example/status-with-message-example.component';

const EXAMPLES = [StatusExampleComponent, StatusWithMessageExampleComponent];

@NgModule({
  imports: [CommonModule, StatusModule, IconCloudModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class StatusExamplesModule {}

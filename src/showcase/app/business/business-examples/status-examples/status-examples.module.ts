import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatusModule } from '@sbb-esta/angular-business/status';

import { provideExamples } from '../../../shared/example-provider';

import { StatusExampleComponent } from './status-example/status-example.component';
import { StatusWithMessageExampleComponent } from './status-with-message-example/status-with-message-example.component';

const EXAMPLES = [StatusExampleComponent, StatusWithMessageExampleComponent];

const EXAMPLE_INDEX = {
  'status-example': StatusExampleComponent,
  'status-with-message-example': StatusWithMessageExampleComponent,
};

@NgModule({
  imports: [CommonModule, StatusModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'status', EXAMPLE_INDEX)],
})
export class StatusExamplesModule {}

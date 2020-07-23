import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { NotificationModule } from '@sbb-esta/angular-public/notification';

import { provideExamples } from '../../../shared/example-provider';

import { NotificationExampleComponent } from './notification-example/notification-example.component';

const EXAMPLES = [NotificationExampleComponent];

const EXAMPLE_INDEX = {
  'notification-example': NotificationExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    FieldModule,
    NotificationModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'notification', EXAMPLE_INDEX)],
})
export class NotificationExamplesModule {}

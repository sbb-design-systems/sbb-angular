import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbFieldModule } from '@sbb-esta/angular-public/field';
import { SbbNotificationModule } from '@sbb-esta/angular-public/notification';

import { provideExamples } from '../../../shared/example-provider';

import { CustomIconNotificationExampleComponent } from './custom-icon-notification-example/custom-icon-notification-example.component';
import { JumpmarkNotificationExampleComponent } from './jumpmark-notification-example/jumpmark-notification-example.component';
import { SimpleNotificationExampleComponent } from './simple-notification-example/simple-notification-example.component';

const EXAMPLES = [
  CustomIconNotificationExampleComponent,
  JumpmarkNotificationExampleComponent,
  SimpleNotificationExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-notification-example': SimpleNotificationExampleComponent,
  'custom-icon-notification-example': CustomIconNotificationExampleComponent,
  'jumpmark-notification-example': JumpmarkNotificationExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbFieldModule,
    SbbNotificationModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'notification', EXAMPLE_INDEX)],
})
export class NotificationExamplesModule {}

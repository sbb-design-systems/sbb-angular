import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbFieldModule } from '@sbb-esta/angular-business/field';
import { SbbNotificationModule } from '@sbb-esta/angular-business/notification';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { provideExamples } from '../../../shared/example-provider';

import { ClosableNotificationExampleComponent } from './closable-notification-example/closable-notification-example.component';
import { CustomIconNotificationExampleComponent } from './custom-icon-notification-example/custom-icon-notification-example.component';
import { JumpmarkNotificationExampleComponent } from './jumpmark-notification-example/jumpmark-notification-example.component';
import { SimpleNotificationExampleComponent } from './simple-notification-example/simple-notification-example.component';

const EXAMPLES = [
  ClosableNotificationExampleComponent,
  CustomIconNotificationExampleComponent,
  JumpmarkNotificationExampleComponent,
  SimpleNotificationExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-notification-example': SimpleNotificationExampleComponent,
  'custom-icon-notification-example': CustomIconNotificationExampleComponent,
  'jumpmark-notification-example': JumpmarkNotificationExampleComponent,
  'closable-notification-example': ClosableNotificationExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbFieldModule,
    SbbNotificationModule,
    SbbIconModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'notification', EXAMPLE_INDEX)],
})
export class NotificationExamplesModule {}

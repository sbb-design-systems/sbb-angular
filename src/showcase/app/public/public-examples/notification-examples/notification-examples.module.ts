import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconBulbOnModule } from '@sbb-esta/angular-icons/community';
import { IconClockModule } from '@sbb-esta/angular-icons/timetable';
import { IconCloudSunshineModule } from '@sbb-esta/angular-icons/weather';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { NotificationModule } from '@sbb-esta/angular-public/notification';

import { NotificationExampleComponent } from './notification-example/notification-example.component';

const EXAMPLES = [NotificationExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconBulbOnModule,
    IconClockModule,
    IconCloudSunshineModule,
    FieldModule,
    NotificationModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class NotificationExamplesModule {}

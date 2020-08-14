import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import {
  IconLockerModule,
  IconMoneyExchangeModule,
  IconStationModule,
  IconWaitingRoomModule,
} from '@sbb-esta/angular-icons/station';

import { provideExamples } from '../../../shared/example-provider';

import { IconSidebarExampleComponent } from './icon-sidebar-example/icon-sidebar-example.component';

const EXAMPLES = [IconSidebarExampleComponent];

const EXAMPLE_INDEX = {
  'icon-sidebar-example': IconSidebarExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    SbbSidebarModule,
    IconStationModule,
    IconLockerModule,
    IconMoneyExchangeModule,
    IconWaitingRoomModule,
    FormsModule,
    CheckboxModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'sidebar', EXAMPLE_INDEX)],
})
export class SidebarExamplesModule {}

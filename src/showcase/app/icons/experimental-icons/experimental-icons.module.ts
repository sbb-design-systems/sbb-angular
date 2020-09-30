import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SbbTooltipModule } from '@sbb-esta/angular-business/tooltip';
import { ɵIconModule } from '@sbb-esta/angular-icons/experimental/_meta';
import { SbbCheckboxPanelModule } from '@sbb-esta/angular-public/checkbox-panel';
import { SbbSearchModule } from '@sbb-esta/angular-public/search';

import { ExperimentalIconSearchComponent } from './experimental-icon-search/experimental-icon-search.component';
import { ExperimentalIconsRoutingModule } from './experimental-icons-routing.module';

@NgModule({
  declarations: [ExperimentalIconSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalModule,
    SbbCheckboxPanelModule,
    SbbSearchModule,
    SbbTooltipModule,
    ExperimentalIconsRoutingModule,
    ɵIconModule,
  ],
})
export class ExperimentalIconsModule {}

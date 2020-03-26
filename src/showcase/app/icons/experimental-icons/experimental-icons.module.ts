import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from '@sbb-esta/angular-business/tooltip';
import { ICON_CLASS_LIST, ɵIconModule } from '@sbb-esta/angular-icons/experimental/_meta';
import { CheckboxPanelModule } from '@sbb-esta/angular-public/checkbox-panel';
import { SearchModule } from '@sbb-esta/angular-public/search';

import { ExperimentalIconSearchComponent } from './experimental-icon-search/experimental-icon-search.component';
import { ExperimentalIconsRoutingModule } from './experimental-icons-routing.module';

@NgModule({
  declarations: [ExperimentalIconSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalModule,
    CheckboxPanelModule,
    SearchModule,
    TooltipModule,
    ExperimentalIconsRoutingModule,
    ɵIconModule
  ]
})
export class ExperimentalIconsModule {}

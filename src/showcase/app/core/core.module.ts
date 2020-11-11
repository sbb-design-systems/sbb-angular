import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SbbAccordionModule } from '@sbb-esta/angular-business/accordion';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbDialogModule } from '@sbb-esta/angular-business/dialog';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import { SbbTooltipModule } from '@sbb-esta/angular-business/tooltip';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbLoadingModule } from '@sbb-esta/angular-public/loading';
import { SbbPaginationModule } from '@sbb-esta/angular-public/pagination';
import { SbbSelectModule } from '@sbb-esta/angular-public/select';
import { SbbTabsModule } from '@sbb-esta/angular-public/tabs';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { CoreExamplesModule } from './core-examples/core-examples.module';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core/core.component';
import { CdnIconDialogComponent } from './icon-overview/cdn-icon-list/cdn-icon-dialog/cdn-icon-dialog.component';
import { CdnIconListComponent } from './icon-overview/cdn-icon-list/cdn-icon-list.component';
import { CdnIconComponent } from './icon-overview/cdn-icon-list/cdn-icon/cdn-icon.component';
import { IconOverviewComponent } from './icon-overview/icon-overview.component';

@NgModule({
  declarations: [
    CoreComponent,
    IconOverviewComponent,
    CdnIconComponent,
    CdnIconListComponent,
    CdnIconDialogComponent,
  ],
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    SbbTabsModule,
    CoreRoutingModule,
    CoreExamplesModule,
    SbbIconModule,
    SbbTooltipModule,
    SbbLoadingModule,
    SbbDialogModule,
    SbbButtonModule,
    SbbCheckboxModule,
    ReactiveFormsModule,
    SbbSelectModule,
    SbbFormFieldModule,
    SbbPaginationModule,
    SbbSidebarModule,
    SbbAccordionModule,
  ],
})
export class CoreModule {}

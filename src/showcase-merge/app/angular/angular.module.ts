import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SbbDialogModule, SbbTooltipModule } from '@sbb-esta/angular-business';
import { SbbAccordionModule } from '@sbb-esta/angular-business/accordion';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import { SbbPaginationModule } from '@sbb-esta/angular-public/pagination';
import { SbbTabsModule } from '@sbb-esta/angular-public/tabs';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbLoadingModule } from '@sbb-esta/angular/loading';
import { SbbSelectModule } from '@sbb-esta/angular/select';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { AngularRoutingModule } from './angular-routing.module';
import { AngularComponent } from './angular/angular.component';
import { CdnIconDialogComponent } from './angular/icon-overview/cdn-icon-list/cdn-icon-dialog/cdn-icon-dialog.component';
import { CdnIconListComponent } from './angular/icon-overview/cdn-icon-list/cdn-icon-list.component';
import { CdnIconComponent } from './angular/icon-overview/cdn-icon-list/cdn-icon/cdn-icon.component';
import { IconOverviewComponent } from './angular/icon-overview/icon-overview.component';

@NgModule({
  declarations: [
    AngularComponent,
    IconOverviewComponent,
    CdnIconComponent,
    CdnIconListComponent,
    CdnIconDialogComponent,
  ],
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    AngularRoutingModule,
    ReactiveFormsModule,
    ComponentViewerModule,
    SbbTabsModule,
    SbbSidebarModule,
    SbbAccordionModule,
    SbbPaginationModule,
    SbbLoadingModule,
    SbbTooltipModule,
    SbbFormFieldModule,
    SbbSelectModule,
    SbbIconModule,
    SbbDialogModule,
    SbbCheckboxModule,
    SbbButtonModule,
  ],
})
export class AngularModule {}

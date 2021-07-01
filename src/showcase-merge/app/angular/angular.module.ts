import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SbbDialogModule } from '@sbb-esta/angular-business/dialog';
import { SbbTooltipModule } from '@sbb-esta/angular-business/tooltip';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbLoadingModule } from '@sbb-esta/angular/loading';
import { SbbPaginationModule } from '@sbb-esta/angular/pagination';
import { SbbSelectModule } from '@sbb-esta/angular/select';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { AngularRoutingModule } from './angular-routing.module';
import { CdnIconDialogComponent } from './icon-overview/cdn-icon-list/cdn-icon-dialog/cdn-icon-dialog.component';
import { CdnIconListComponent } from './icon-overview/cdn-icon-list/cdn-icon-list.component';
import { CdnIconComponent } from './icon-overview/cdn-icon-list/cdn-icon/cdn-icon.component';
import { IconOverviewComponent } from './icon-overview/icon-overview.component';

@NgModule({
  declarations: [
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

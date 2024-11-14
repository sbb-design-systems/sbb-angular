import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbDialogModule } from '@sbb-esta/angular/dialog';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbLoadingIndicatorModule } from '@sbb-esta/angular/loading-indicator';
import { SbbPaginationModule } from '@sbb-esta/angular/pagination';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

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
    PortalModule,
    SharedModule,
    AngularRoutingModule,
    ReactiveFormsModule,
    ComponentViewerModule,
    SbbPaginationModule,
    SbbLoadingIndicatorModule,
    SbbTooltipModule,
    SbbInputModule,
    SbbSelectModule,
    SbbIconModule,
    SbbDialogModule,
    SbbCheckboxModule,
    SbbButtonModule,
    CommonModule,
  ],
})
export class AngularModule {}

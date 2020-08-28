import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { DialogModule } from '@sbb-esta/angular-business/dialog';
import { TooltipModule } from '@sbb-esta/angular-business/tooltip';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { LoadingModule } from '@sbb-esta/angular-public/loading';
import { PaginationModule } from '@sbb-esta/angular-public/pagination';
import { SelectModule } from '@sbb-esta/angular-public/select';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

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
    TabsModule,
    CoreRoutingModule,
    CoreExamplesModule,
    SbbIconModule,
    TooltipModule,
    LoadingModule,
    DialogModule,
    ButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    SelectModule,
    FieldModule,
    PaginationModule,
  ],
})
export class CoreModule {}

import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { DialogModule } from '@sbb-esta/angular-business/dialog';
import { LoadingModule } from '@sbb-esta/angular-business/loading';
import { TooltipModule } from '@sbb-esta/angular-business/tooltip';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { CoreExamplesModule } from './core-examples/core-examples.module';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core/core.component';
import { CdnIconDetailComponent } from './icon-overview/cdn-icon-detail/cdn-icon-detail.component';
import { CdnIconListComponent } from './icon-overview/cdn-icon-list/cdn-icon-list.component';
import { CdnIconComponent } from './icon-overview/cdn-icon/cdn-icon.component';
import { IconOverviewComponent } from './icon-overview/icon-overview.component';

@NgModule({
  declarations: [
    CoreComponent,
    IconOverviewComponent,
    CdnIconComponent,
    CdnIconListComponent,
    CdnIconDetailComponent,
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
  ],
})
export class CoreModule {}

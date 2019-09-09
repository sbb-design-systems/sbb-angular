import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ICON_COMPONENT_LIST } from '@sbb-esta/angular-icons';
import { SearchModule } from '@sbb-esta/angular-public/search';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SharedModule } from '../shared/shared.module';

import { IconSearchComponent } from './icon-search/icon-search.component';
import { IconViewerDirective } from './icon-viewer.directive';
import { IconViewerComponent } from './icon-viewer/icon-viewer.component';
import { IconsRoutingModule } from './icons-routing.module';
import { IconsComponent } from './icons/icons.component';

@NgModule({
  declarations: [IconViewerDirective, IconsComponent, IconViewerComponent, IconSearchComponent],
  entryComponents: ICON_COMPONENT_LIST,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalModule,
    PerfectScrollbarModule,
    SearchModule,
    SharedModule,
    IconsRoutingModule
  ]
})
export class IconsModule {}

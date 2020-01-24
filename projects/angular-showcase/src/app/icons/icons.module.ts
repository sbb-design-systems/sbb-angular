import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { ICON_COMPONENT_LIST, IconCollectionModule } from '@sbb-esta/angular-icons';
import { ICON_CLASS_LIST, ICON_MODULE_LIST } from '@sbb-esta/angular-icons/experimental/_meta';
import { CheckboxPanelModule } from '@sbb-esta/angular-public/checkbox-panel';
import { SearchModule } from '@sbb-esta/angular-public/search';

import { SharedModule } from '../shared/shared.module';

import { ExperimentalIconSearchComponent } from './experimental-icon-search/experimental-icon-search.component';
import { IconSearchComponent } from './icon-search/icon-search.component';
import { IconViewerDirective } from './icon-viewer.directive';
import { IconViewerComponent } from './icon-viewer/icon-viewer.component';
import { IconsRoutingModule } from './icons-routing.module';
import { IconsComponent } from './icons/icons.component';

@NgModule({
  declarations: [
    IconViewerDirective,
    IconsComponent,
    IconViewerComponent,
    IconSearchComponent,
    ExperimentalIconSearchComponent
  ],
  entryComponents: [...ICON_COMPONENT_LIST, ...ICON_CLASS_LIST],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalModule,
    IconCollectionModule,
    ScrollingModule,
    CheckboxPanelModule,
    SearchModule,
    SharedModule,
    ...ICON_MODULE_LIST,
    IconsRoutingModule
  ]
})
export class IconsModule {}

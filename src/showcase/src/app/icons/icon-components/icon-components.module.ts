import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ICON_COMPONENT_LIST, IconCollectionModule } from '@sbb-esta/angular-icons';
import { SearchModule } from '@sbb-esta/angular-public/search';

import { IconComponentsRoutingModule } from './icon-components-routing.module';
import { IconSearchComponent } from './icon-search/icon-search.component';
import { IconViewerComponent } from './icon-viewer/icon-viewer.component';

@NgModule({
  declarations: [IconSearchComponent, IconViewerComponent],
  entryComponents: [...ICON_COMPONENT_LIST],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalModule,
    SearchModule,
    IconCollectionModule,
    IconComponentsRoutingModule
  ]
})
export class IconComponentsModule {}

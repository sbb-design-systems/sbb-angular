import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { SbbSearchModule } from '@sbb-esta/angular-public/search';

import { IconComponentsRoutingModule } from './icon-components-routing.module';
import { IconSearchComponent } from './icon-search/icon-search.component';
import { IconViewerComponent } from './icon-viewer/icon-viewer.component';

@NgModule({
  declarations: [IconSearchComponent, IconViewerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalModule,
    SbbSearchModule,
    IconCollectionModule,
    IconComponentsRoutingModule,
  ],
})
export class IconComponentsModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search-component/search.component';
import { NavlistComponent } from './navlist-component/navlist.component';
import { SearchIconComponent } from './search-icon/search-icon.component';
import { NavlistIconComponent } from './navlist-icon/navlist-icon.component';
import { ContentComponent } from './content/content.component';

import { ComponentUiService } from './services/component-ui.service';
import { IconUiService } from './services/icon-ui.service';
import { AccordionNotificationService } from './services/accordion-notification.service';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { IconCommonModule } from 'sbb-angular';

import { IconViewerDirective } from './directives/icon-viewer.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { map } from './shared/sbb-components-mapping-export';
import { ReplacePipe } from './shared/replace.pipe';

const entryComponents = Object.values(map);

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    NavlistComponent,
    ContentComponent,
    HomeComponent,
    IconViewerDirective,
    NavlistIconComponent,
    SearchIconComponent,
    ReplacePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    NgbModule,
    IconCommonModule
  ],
  entryComponents: entryComponents,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [ComponentUiService, IconUiService, AccordionNotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

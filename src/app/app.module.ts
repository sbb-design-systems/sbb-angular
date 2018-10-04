import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

import { IconViewerDirective } from './directives/icon-viewer.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReplacePipe } from './shared/replace.pipe';
import { IconComponents } from './sbb-components-mapping-export';
import { IconCommonModule } from 'sbb-angular';
import { ComponentViewerDirective } from './directives/component-viewer.directive';
import { ExamplesModule } from './examples/examples.module';
import { TextareaShowcaseComponent } from './examples/textarea-showcase/textarea-showcase.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    NavlistComponent,
    ContentComponent,
    HomeComponent,
    IconViewerDirective,
    ComponentViewerDirective,
    NavlistIconComponent,
    SearchIconComponent,
    ReplacePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    MonacoEditorModule.forRoot(),
    AppRoutingModule,
    IconCommonModule.withComponents(IconComponents.types),
    ExamplesModule
  ],
  providers: [ComponentUiService, IconUiService, AccordionNotificationService],
  entryComponents: [TextareaShowcaseComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

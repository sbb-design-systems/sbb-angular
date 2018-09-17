import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { NavlistComponent } from './navlist/navlist.component';
import { ContentComponent } from './content/content.component';

import { ComponentUiService } from './services/component-ui.service';
import { AccordionNotificationService } from './services/accordion-notification.service';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    NavlistComponent,
    ContentComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [ComponentUiService, AccordionNotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
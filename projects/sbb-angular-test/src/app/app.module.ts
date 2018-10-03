import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LinksModule, IconCommonModule } from 'sbb-angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    LinksModule,
    IconCommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

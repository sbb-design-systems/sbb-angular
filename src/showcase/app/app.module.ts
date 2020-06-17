import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from '@sbb-esta/angular-business/header';
import { SBB_ICON_REGISTRY_PROVIDER } from '@sbb-esta/angular-core/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroductionComponent } from './introduction/introduction.component';

@NgModule({
  declarations: [AppComponent, IntroductionComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ScrollingModule,
    HeaderModule,
    HttpClientModule,
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
  providers: [SBB_ICON_REGISTRY_PROVIDER],
})
export class AppModule {}

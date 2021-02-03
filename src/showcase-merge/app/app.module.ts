import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SbbHeaderModule } from '@sbb-esta/angular-business/header';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbIconModule, SBB_ICON_REGISTRY_PROVIDER } from '@sbb-esta/angular/icon';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HowToUpdateComponent } from './howtoupdate/how-to-update.component';
import { IntroductionComponent } from './introduction/introduction.component';

@NgModule({
  declarations: [AppComponent, IntroductionComponent, HowToUpdateComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ScrollingModule,
    SbbHeaderModule,
    HttpClientModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbSidebarModule,
    SbbIconModule,
    SbbRadioButtonModule,
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
  providers: [SBB_ICON_REGISTRY_PROVIDER],
})
export class AppModule {}

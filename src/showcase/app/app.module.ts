import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { GranularSanityChecks, SBB_SANITY_CHECKS } from '@sbb-esta/angular/core';
import { SbbHeaderLeanModule } from '@sbb-esta/angular/header-lean';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbNotificationToastModule } from '@sbb-esta/angular/notification-toast';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbSidebarModule } from '@sbb-esta/angular/sidebar';

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
    SbbHeaderLeanModule,
    HttpClientModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbSidebarModule,
    SbbIconModule,
    SbbRadioButtonModule,
    SbbNotificationModule,
    SbbNotificationToastModule,
    SbbInputModule,
    SbbSelectModule,
    FormsModule,
  ],
  providers: [
    {
      provide: SBB_SANITY_CHECKS,
      useValue: { doctype: true, typography: true, version: false } as GranularSanityChecks,
    },
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

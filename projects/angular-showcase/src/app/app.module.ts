import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ICON_COMPONENT_LIST, IconCollectionModule } from '@sbb-esta/angular-icons';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BusinessModule } from './business/business.module';
import { IntroductionComponent } from './introduction/introduction.component';
import { PublicModule } from './public/public.module';

@NgModule({
  declarations: [AppComponent, IntroductionComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot({ baseUrl: './assets' }),
    IconCollectionModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    PerfectScrollbarModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PublicModule,
    BusinessModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [...ICON_COMPONENT_LIST]
})
export class AppModule {}

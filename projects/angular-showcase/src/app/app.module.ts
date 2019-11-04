import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from '@sbb-esta/angular-business/header';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { ICON_COMPONENT_LIST, IconCollectionModule } from '@sbb-esta/angular-icons';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BusinessModule } from './business/business.module';
import { CoreModule } from './core/core.module';
import { IconsModule } from './icons/icons.module';
import { IntroductionComponent } from './introduction/introduction.component';
import { KeycloakModule } from './keycloak/keycloak.module';
import { PublicModule } from './public/public.module';

@NgModule({
  declarations: [AppComponent, IntroductionComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot({ baseUrl: './assets' }),
    IconCollectionModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    ScrollingModule,
    HeaderModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PublicModule,
    BusinessModule,
    KeycloakModule,
    CoreModule,
    IconsModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [...ICON_COMPONENT_LIST]
})
export class AppModule {}

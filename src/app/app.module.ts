import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search-component/search.component';
import { NavlistComponent } from './navlist-component/navlist.component';
import { SearchIconComponent } from './search-icon/search-icon.component';
import { NavlistIconComponent } from './navlist-icon/navlist-icon.component';
import { ContentComponent } from './content/content.component';

import { IconViewerDirective } from './directives/icon-viewer.directive';

import { ReplacePipe } from './shared/replace.pipe';
import { IconComponents } from './sbb-components-mapping-export';
import { IconCommonModule } from 'sbb-angular';
import { ComponentViewerDirective } from './directives/component-viewer.directive';
import { ExamplesModule } from './examples/examples.module';
import { TextareaShowcaseComponent } from './examples/textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './examples/links-showcase/links-showcase.component';
import { AutocompleteShowcaseComponent } from './examples/autocomplete-showcase/autocomplete-showcase.component';
import { RadioButtonShowcaseComponent } from './examples/radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './examples/checkbox-showcase/checkbox-showcase.component';
import { InputFieldShowcaseComponent } from './examples/input-field-showcase/input-field-showcase.component';
import { SbbFieldShowcaseComponent } from './examples/sbb-field-showcase/sbb-field-showcase.component';


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
    MonacoEditorModule.forRoot({baseUrl: './assets'}),
    AppRoutingModule,
    IconCommonModule.withComponents(IconComponents.types),
    ExamplesModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    InputFieldShowcaseComponent,
    SbbFieldShowcaseComponent
  ]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ButtonShowcaseComponent } from './examples/button-showcase/button-showcase.component';
import { RadioButtonShowcaseComponent } from './examples/radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './examples/checkbox-showcase/checkbox-showcase.component';
import { TimeInputShowcaseComponent } from './examples/time-input-showcase/time-input-showcase.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ComponentsListComponent } from './components-list/components-list.component';
import { IconsListComponent } from './icons-list/icons-list.component';
import { DocDirective } from './doc/doc.directive';
import { ExamplesIconDocComponent } from './doc/examples-icon-doc/examples-icon-doc.component';
import { ExamplesTabDocComponent } from './doc/examples-doc/examples-tab-doc.component';
import { FieldShowcaseComponent } from './examples/field-showcase/field-showcase.component';
import { ComponentViewerComponent } from './shared/component-viewer/component-viewer.component';
import { DatepickerShowcaseComponent } from './examples/datepicker-showcase/datepicker-showcase.component';
import { TabsShowcaseComponent } from './examples/tabs-showcase/tabs-showcase.component';
import { PersonListComponent } from './examples/tabs-showcase/person/person-list/person-list.component';
import { LoadingShowcaseComponent } from './examples/loading-showcase/loading-showcase.component';

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
    ReplacePipe,
    ComponentsListComponent,
    IconsListComponent,
    DocDirective,
    ExamplesTabDocComponent,
    ExamplesIconDocComponent,
    ComponentViewerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    MonacoEditorModule.forRoot({ baseUrl: './assets' }),
    AppRoutingModule,
    IconCommonModule,
    ExamplesModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    PerfectScrollbarModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    FieldShowcaseComponent,
    TabsShowcaseComponent,
    PersonListComponent,
    ComponentViewerComponent,
    DatepickerShowcaseComponent,
    TimeInputShowcaseComponent,
    LoadingShowcaseComponent,
    ...IconComponents.types
  ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SbbModule } from './sbb.module';
import { SbbAngularDocsExample } from './sbb-angular-docs-example';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [SbbAngularDocsExample],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DragDropModule,
    SbbModule,
  ],
  providers: [],
  bootstrap: [SbbAngularDocsExample],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SbbModule } from './{moduleName}';
import { {componentName} } from './{selectorName}';

@NgModule({
  imports:      [ BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, SbbModule ],
  declarations: [ {componentName} ],
  bootstrap:    [ {componentName} ],
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleComponent } from './toggle/toggle.component';
import { ToggleOptionComponent } from './toggle-option/toggle-option.component';

@NgModule({
  declarations: [
    ToggleComponent,
    ToggleOptionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToggleComponent,
    ToggleOptionComponent
  ]
})
export class ToggleModule { }

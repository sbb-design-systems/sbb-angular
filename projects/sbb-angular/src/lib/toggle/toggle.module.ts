import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleComponent } from './toggle/toggle.component';
import { ToggleOptionComponent } from './toggle-option/toggle-option.component';
import { ToggleOptionIconDirective } from './toggle-option/toggle-option-icon.directive';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';

@NgModule({
  declarations: [
    ToggleComponent,
    ToggleOptionComponent,
    ToggleOptionIconDirective
  ],
  imports: [
    CommonModule,
    IconCommonModule
  ],
  exports: [
    ToggleComponent,
    ToggleOptionComponent,
    ToggleOptionIconDirective
  ]
})
export class ToggleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { CheckboxPanelComponent } from './checkbox-panel/checkbox-panel.component';
import { IconCheckModule } from '../svg-icons/svg-icons';

@NgModule({

  imports: [
    CommonModule,
    CheckboxModule,
    IconCheckModule,
  ],
  declarations: [
    CheckboxPanelComponent
  ],
  exports: [
    CheckboxPanelComponent
  ]
})
export class CheckboxPanelModule { }

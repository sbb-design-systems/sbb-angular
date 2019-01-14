import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { CheckboxPanelComponent } from './checkbox-panel/checkbox-panel.component';

@NgModule({

  imports: [
    CommonModule,
    CheckboxModule,
    IconCommonModule
  ],
  declarations: [
    CheckboxPanelComponent
  ],
  exports: [
    CheckboxPanelComponent
  ]
})
export class CheckboxPanelModule { }

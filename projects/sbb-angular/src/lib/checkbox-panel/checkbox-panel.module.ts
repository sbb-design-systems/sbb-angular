import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { CheckboxPanelComponent } from './checkbox-panel/checkbox-panel.component';
import { IconTickModule } from 'sbb-angular-icons';

@NgModule({

  imports: [
    CommonModule,
    CheckboxModule,
    IconTickModule,
  ],
  declarations: [
    CheckboxPanelComponent
  ],
  exports: [
    CheckboxPanelComponent
  ]
})
export class CheckboxPanelModule { }

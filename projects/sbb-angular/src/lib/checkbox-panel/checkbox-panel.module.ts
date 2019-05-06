import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconTickModule } from 'sbb-angular-icons';

import { CheckboxModule } from '../checkbox/checkbox.module';

import { CheckboxPanelComponent } from './checkbox-panel/checkbox-panel.component';

@NgModule({
  imports: [CommonModule, CheckboxModule, IconTickModule],
  declarations: [CheckboxPanelComponent],
  exports: [CheckboxPanelComponent]
})
export class CheckboxPanelModule {}

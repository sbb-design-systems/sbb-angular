import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhettoboxComponent } from './ghettobox/ghettobox.component';
import { GhettoboxContainerComponent } from './ghettobox-container/ghettobox-container.component';

@NgModule({
  declarations: [
    GhettoboxComponent,
    GhettoboxContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GhettoboxComponent,
    GhettoboxContainerComponent
  ]
})
export class GhettoboxModule { }

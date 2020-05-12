import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconHimDisruptionModule } from '@sbb-esta/angular-icons/him-cus';
import { IconHimReplacementbusModule } from '@sbb-esta/angular-icons/him-cus';
import { IconHimConstructionModule } from '@sbb-esta/angular-icons/him-cus';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { GhettoboxModule } from '@sbb-esta/angular-public/ghettobox';

import { GhettoboxExampleComponent } from './ghettobox-example/ghettobox-example.component';

const EXAMPLES = [GhettoboxExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IconHimDisruptionModule,
    IconHimReplacementbusModule,
    IconHimConstructionModule,
    GhettoboxModule,
    ButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class GhettoboxExamplesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

import { TabsExample } from './tabs/tabs-example';

export { TabsExample };

const EXAMPLES = [TabsExample];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SbbTabsModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TabsExamplesModule {}

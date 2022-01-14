import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { ButtonOverviewExample } from './button-overview/button-overview-example';
import { ButtonWithIconExample } from './button-with-icon/button-with-icon-example';
import { LinkGroupExample } from './link-group/link-group-example';
import { LinkExample } from './link/link-example';

export { ButtonOverviewExample, ButtonWithIconExample, LinkExample, LinkGroupExample };

const EXAMPLES = [ButtonOverviewExample, ButtonWithIconExample, LinkExample, LinkGroupExample];

@NgModule({
  imports: [CommonModule, FormsModule, SbbButtonModule, SbbCheckboxModule, SbbIconModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class AutocompleteExamplesModule {}

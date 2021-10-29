import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbUsermenuModule } from '@sbb-esta/angular/usermenu';

import { UsermenuCustomIconExample } from './usermenu-custom-icon/usermenu-custom-icon-example';
import { UsermenuCustomImageExample } from './usermenu-custom-image/usermenu-custom-image-example';
import { UsermenuDisplayNameAndUserNameExample } from './usermenu-display-name-and-user-name/usermenu-display-name-and-user-name-example';
import { UsermenuDisplayNameExample } from './usermenu-display-name/usermenu-display-name-example';
import { UsermenuUserNameExample } from './usermenu-user-name/usermenu-user-name-example';

export {
  UsermenuCustomImageExample,
  UsermenuCustomIconExample,
  UsermenuUserNameExample,
  UsermenuDisplayNameExample,
  UsermenuDisplayNameAndUserNameExample,
};

const EXAMPLES = [
  UsermenuCustomImageExample,
  UsermenuCustomIconExample,
  UsermenuUserNameExample,
  UsermenuDisplayNameExample,
  UsermenuDisplayNameAndUserNameExample,
];

@NgModule({
  imports: [CommonModule, RouterModule, SbbUsermenuModule, SbbIconModule, SbbMenuModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class UsermenuExamplesModule {}

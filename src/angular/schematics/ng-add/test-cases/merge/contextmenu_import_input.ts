import { Component, NgModule } from '@angular/core';
import { SbbContextmenuModule } from '@sbb-esta/angular-business/contextmenu';

@Component({
  selector: 'sbb-contextmenu-test',
  template: ``,
})
export class SbbMenuTestComponent {}

@NgModule({
  declarations: [SbbMenuTestComponent],
  imports: [SbbContextmenuModule],
})
export class ContextmenuTestModule {}

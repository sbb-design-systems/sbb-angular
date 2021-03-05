import { Component, NgModule } from '@angular/core';
import { SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbIconModule } from '@sbb-esta/angular/icon';

@Component({
  selector: 'sbb-contextmenu-test',
  template: ``,
})
export class SbbMenuTestComponent {}

@NgModule({
  declarations: [SbbMenuTestComponent],
  imports: [SbbMenuModule, SbbIconModule],
})
export class ContextmenuTestModule {}

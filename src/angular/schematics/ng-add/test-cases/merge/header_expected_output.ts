import { Component, NgModule } from '@angular/core';
import { SbbHeaderLeanModule } from '@sbb-esta/angular/header-lean';

@Component({
  selector: 'sbb-header-test',
  template: `
  `,
})
export class HeaderTestComponent {}

@NgModule({
  declarations: [HeaderTestComponent],
  imports: [SbbHeaderLeanModule],
})
export class HeaderTestModule {}

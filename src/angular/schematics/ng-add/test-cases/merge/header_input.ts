import { Component, NgModule } from '@angular/core';
import { SbbHeaderModule } from '@sbb-esta/angular-business';

@Component({
  selector: 'sbb-header-test',
  template: `
  `,
})
export class HeaderTestComponent {}

@NgModule({
  declarations: [HeaderTestComponent],
  imports: [SbbHeaderModule],
})
export class HeaderTestModule {}

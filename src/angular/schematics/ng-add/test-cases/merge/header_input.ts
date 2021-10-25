import { Component, NgModule } from '@angular/core';
import { SbbHeaderModule } from '@sbb-esta/angular-business';

@Component({
  selector: 'sbb-header-test',
  template: `
    <sbb-header [label]="Title" [subtitle]="Subtitle">
      <a routerLink="/">Home</a>
      <sbb-app-chooser-section label="Apps">
        <a href="https://other-app.app.sbb.ch">Other App</a>
        <a href="https://alternative-app.app.sbb.ch">Alternative App</a>
      </sbb-app-chooser-section>
      <sbb-app-chooser-section label="Angular">
        <a href="https://angular.io">Angular</a>
      </sbb-app-chooser-section>
    </sbb-header>
  `,
})
export class HeaderTestComponent {}

@NgModule({
  declarations: [HeaderTestComponent],
  imports: [SbbHeaderModule],
})
export class HeaderTestModule {}

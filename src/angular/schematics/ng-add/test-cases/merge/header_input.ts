import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbHeaderModule, SbbHeader, SbbHeaderEnvironment } from '@sbb-esta/angular-business';

@Component({
  selector: 'sbb-header-test',
  template: `
    <sbb-header [label]="Title" [subtitle]="Subtitle">
      <sbb-header-environment>dev</sbb-header-environment>
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
export class HeaderTestComponent {
  @ViewChild(SbbHeader) header: SbbHeader;
  @ViewChild(SbbHeaderEnvironment) env: SbbHeaderEnvironment;
}

@NgModule({
  declarations: [HeaderTestComponent],
  imports: [SbbHeaderModule],
})
export class HeaderTestModule {}

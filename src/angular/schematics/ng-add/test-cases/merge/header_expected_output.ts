import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbHeaderLeanModule, SbbHeaderLean, SbbHeaderEnvironment } from '@sbb-esta/angular/header-lean';

@Component({
  selector: 'sbb-header-test',
  template: `
    <sbb-header-lean [label]="Title" [subtitle]="Subtitle" class="sbb-header-fixed-columns">
      <sbb-header-environment>dev</sbb-header-environment>
      <a routerLink="/">Home</a>
      <sbb-app-chooser-section label="Apps">
        <a href="https://other-app.app.sbb.ch">Other App</a>
        <a href="https://alternative-app.app.sbb.ch">Alternative App</a>
      </sbb-app-chooser-section>
      <sbb-app-chooser-section label="Angular">
        <a href="https://angular.io">Angular</a>
      </sbb-app-chooser-section>
    </sbb-header-lean>
  `,
})
export class HeaderTestComponent {
  @ViewChild(SbbHeaderLean) header: SbbHeaderLean;
  @ViewChild(SbbHeaderEnvironment) env: SbbHeaderEnvironment;
}

@NgModule({
  declarations: [HeaderTestComponent],
  imports: [SbbHeaderLeanModule],
})
export class HeaderTestModule {}

import { Component, NgModule } from '@angular/core';
import { SbbGhettoboxModule } from '@sbb-esta/angular-public';

@Component({
  selector: 'test',
  template: `
    <sbb-ghettobox>
      <sbb-icon svgIcon="fpl:disruption" *sbbIcon></sbb-icon>
      This is a simple message with a simple <a href="#">Link</a> inside.
    </sbb-ghettobox>

    <sbb-ghettobox
      (afterDelete)="afterDelete($event)"
      [routerLink]="['.', 'test']"
      [queryParams]="{debug: false}"
      fragment="test"
    >
      <sbb-icon svgIcon="fpl:disruption" *sbbIcon></sbb-icon>
      This is a Link ghettobox with custom icon.
    </sbb-ghettobox>

    <sbb-ghettobox-container>
      <sbb-ghettobox [routerLink]="['.', 'test']" [queryParams]="{debug: true}" fragment="test">
        <sbb-icon svgIcon="fpl:disruption" *sbbIcon></sbb-icon>
        This is an initial ghettobox into a container.
      </sbb-ghettobox>
    </sbb-ghettobox-container>
  `,
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent],
  imports: [SbbGhettoboxModule],
})
export class GhettoboxTestModule {}

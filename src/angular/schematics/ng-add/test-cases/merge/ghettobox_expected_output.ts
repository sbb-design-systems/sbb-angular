import { Component, NgModule } from '@angular/core';
import { SbbGhettoboxModule } from '@sbb-esta/angular/ghettobox';

@Component({
  selector: 'test',
  template: `
    <sbb-ghettobox indicatorIcon="fpl:disruption">
      
      This is a simple message with a simple <a href="#">Link</a> inside.
    </sbb-ghettobox>

    <a sbbGhettobox
      (dismissed)="afterDelete($event)"
      [routerLink]="['.', 'test']"
      [queryParams]="{debug: false}"
      fragment="test"
     indicatorIcon="fpl:disruption">
      
      This is a Link ghettobox with custom icon.
    </a>

    <sbb-ghettobox-outlet>
      <a sbbGhettobox [routerLink]="['.', 'test']" [queryParams]="{debug: true}" fragment="test" indicatorIcon="fpl:disruption">
        
        This is an initial ghettobox into a container.
      </a>
    </sbb-ghettobox-outlet>
  `,
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent],
  imports: [SbbGhettoboxModule],
})
export class GhettoboxTestModule {}

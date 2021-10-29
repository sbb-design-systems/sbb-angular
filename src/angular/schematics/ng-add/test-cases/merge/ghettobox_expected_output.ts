import { Component, NgModule } from '@angular/core';
import { SbbAlertModule, SbbAlertService, SBB_GHETTOBOX_ANIMATIONS, SBB_GHETTOBOX_PANEL_ANIMATION_TIMING, SBB_GHETTOBOX_PANEL_ONDELETE_TIMING, SbbAlertOutlet, SbbAlertConfig, SbbGhettoboxContainerService, SbbAlertRef, SbbAlertState, SbbGhettoboxDeletedEvent, SbbAlert } from '@sbb-esta/angular/alert';

@Component({
  selector: 'test',
  template: `
    <sbb-alert svgIcon="fpl:disruption">

      This is a simple message with a simple <a href="#">Link</a> inside.
    </sbb-alert>

    <a sbbAlert svgIcon="fpl:disruption"
      (dismissed)="afterDelete($event)"
      [routerLink]="['.', 'test']"
      [queryParams]="{ debug: false }"
      fragment="test"
    >

      This is a Link ghettobox with custom icon.
    </a>

    <sbb-alert-outlet>
      <a sbbAlert svgIcon="fpl:disruption" [routerLink]="['.', 'test']" [queryParams]="{ debug: true }" fragment="test">

        This is an initial ghettobox into a container.
      </a>
    </sbb-alert-outlet>
  `,
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent],
  imports: [SbbAlertModule],
})
export class GhettoboxTestModule {}

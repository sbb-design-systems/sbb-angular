import { Component, NgModule } from '@angular/core';
import { SbbButtonModule, SbbLinksModule } from '@sbb-esta/angular/button';

@Component({
  selector: 'sbb-button-test',
  template: `
    <button sbb-button>Description</button>
    <button sbb-button>Description</button>
    <button sbb-button>Description</button>
    <button sbb-secondary-button>Description</button>
    <button sbb-secondary-button>Description</button>
    <button sbb-ghost-button>Description</button>
    <button sbb-ghost-button>Description</button>
    <button sbb-frameless-button>Description</button>
    <button sbb-frameless-button>Description</button>
    <button sbb-alt-button>Description</button>
    <button sbb-alt-button>Description</button>
    <button sbb-icon-button><sbb-icon [svgIcon]="icon"></sbb-icon></button>
    <button sbb-icon-button><sbb-icon [svgIcon]="icon"></sbb-icon></button>
    <button sbb-button><!-- TODO: Unable to determine selector from mode "mode". Please manually select the appropriate selector: https://angular.app.sbb.ch/angular/components/button -->Description</button>
    <button sbb-button indicatorIcon="kom:download-small">
      
    </button>
    <button sbb-button [indicatorIcon]="icon">
      
    </button>
    <button sbb-button><!-- TODO: Unable to determine custom icon from "<sbb-icon-something>". Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->
      
    </button>
    <button sbb-button><!-- TODO: Unable to determine custom icon from icon "icon". Please manually select a custom indicatorIcon: https://angular.app.sbb.ch/angular/components/button -->Description</button>
    <ng-template #icon><sbb-icon [svgIcon]="icon"></sbb-icon></ng-template>
    <a sbb-link href="#">Description</a>
    <a sbb-link href="#">Description</a>
    <a sbb-link href="#">Description</a>
    <a sbb-link indicatorIcon="kom:download-small" href="#">Description</a>
    <a sbb-link indicatorIcon="kom:download-small" href="#">Description</a>
    <a sbb-link href="#">Description</a>
  `,
})
export class ButtonTestComponent {}

@NgModule({
  declarations: [ButtonTestComponent],
  imports: [SbbButtonModule, SbbButtonModule],
})
export class ButtonTestModule {}

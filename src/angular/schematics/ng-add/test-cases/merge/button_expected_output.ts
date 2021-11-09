import { Component, NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';

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
    <button sbb-button svgIcon="kom:download-small">
      
    </button>
    <button sbb-button [svgIcon]="icon">
      
    </button>
    <button sbb-button><!-- TODO: Unable to determine custom icon from "<sbb-icon-something>". Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/button -->
      
    </button>
    <button sbb-button><!-- TODO: Unable to determine custom icon from icon "icon". Please manually select a custom svgIcon: https://angular.app.sbb.ch/angular/components/button -->Description</button>
    <ng-template #icon><sbb-icon [svgIcon]="icon"></sbb-icon></ng-template>
    <a sbb-link href="#"><!-- TODO: sbbLink[mode] is no longer available. Maybe you want to use a link group? See https://angular.app.sbb.ch/angular/components/button on how to use. -->Description</a>
    <a sbb-link href="#"><!-- TODO: sbbLink[mode] is no longer available. Maybe you want to use a link group? See https://angular.app.sbb.ch/angular/components/button on how to use. -->Description</a>
    <a sbb-link href="#"><!-- TODO: sbbLink[mode] is no longer available. Maybe you want to use a link group? See https://angular.app.sbb.ch/angular/components/button on how to use. -->Description</a>
    <a sbb-link svgIcon="kom:download-small" href="#"><!-- TODO: sbbLink[mode] is no longer available. Maybe you want to use a link group? See https://angular.app.sbb.ch/angular/components/button on how to use. -->Description</a>
    <a sbb-link svgIcon="kom:download-small" href="#"><!-- TODO: sbbLink[mode] is no longer available. Maybe you want to use a link group? See https://angular.app.sbb.ch/angular/components/button on how to use. -->Description</a>
    <a sbb-link href="#"><!-- TODO: sbbLink[mode] is no longer available. Maybe you want to use a link group? See https://angular.app.sbb.ch/angular/components/button on how to use. -->Description</a>
  `,
})
export class ButtonTestComponent {}

@NgModule({
  declarations: [ButtonTestComponent],
  imports: [SbbButtonModule],
})
export class ButtonTestModule {}

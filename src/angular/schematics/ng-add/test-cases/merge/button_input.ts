import { Component, NgModule } from '@angular/core';
import { SbbButtonModule, SbbLinksModule } from '@sbb-esta/angular-public';

@Component({
  selector: 'sbb-button-test',
  template: `
    <button sbbButton>Description</button>
    <button sbbButton mode="primary">Description</button>
    <button sbbButton [mode]="'primary'">Description</button>
    <button sbbButton mode="secondary">Description</button>
    <button sbbButton [mode]="'secondary'">Description</button>
    <button sbbButton mode="ghost">Description</button>
    <button sbbButton [mode]="'ghost'">Description</button>
    <button sbbButton mode="frameless">Description</button>
    <button sbbButton [mode]="'frameless'">Description</button>
    <button sbbButton mode="alternative">Description</button>
    <button sbbButton [mode]="'alternative'">Description</button>
    <button sbbButton mode="icon"><sbb-icon [svgIcon]="icon" *sbbIcon></sbb-icon></button>
    <button sbbButton [mode]="'icon'"><sbb-icon [svgIcon]="icon" *sbbIcon></sbb-icon></button>
    <button sbbButton [mode]="mode">Description</button>
    <button sbbButton>
      <sbb-icon svgIcon="kom:download-small" *sbbIcon></sbb-icon>
    </button>
    <button sbbButton>
      <sbb-icon [svgIcon]="icon" *sbbIcon></sbb-icon>
    </button>
    <button sbbButton>
      <sbb-icon-something class="test" *sbbIcon></sbb-icon-something>
    </button>
    <button sbbButton [icon]="icon">Description</button>
    <ng-template #icon><sbb-icon [svgIcon]="icon"></sbb-icon></ng-template>
    <a sbbLink [mode]="linkMode" href="#">Description</a>
    <a sbbLink [mode]="linkMode" icon="arrow" href="#">Description</a>
    <a sbbLink [mode]="linkMode" [icon]="'arrow'" href="#">Description</a>
    <a sbbLink [mode]="linkMode" icon="download" href="#">Description</a>
    <a sbbLink [mode]="linkMode" [icon]="'download'" href="#">Description</a>
    <a sbbLink [mode]="linkMode" [icon]="icon" href="#">Description</a>
  `,
})
export class ButtonTestComponent {}

@NgModule({
  declarations: [ButtonTestComponent],
  imports: [SbbButtonModule, SbbLinksModule],
})
export class ButtonTestModule {}

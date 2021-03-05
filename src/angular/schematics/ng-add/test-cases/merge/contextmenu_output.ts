import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbMenu, SbbMenuModule } from '@sbb-esta/angular/menu';
import { SbbIconModule } from '@sbb-esta/angular/icon';

@Component({
  selector: 'sbb-contextmenu-test',
  template: `<button [sbbMenuTriggerFor]="dropdown">
    <sbb-icon svgIcon="kom:context-menu-small" class="sbb-icon-fit"></sbb-icon>
  </button>
    <sbb-menu


      [class]="'testclass'"
      (closed)="closed($event)"


      #dropdown="sbbMenu"
    ><!-- TODO: Removed properties autoActiveFirstOption, panelWidth, (optionSelected), (opened) because they no longer exist -->
      <button sbb-menu-item (click)="assignLastAction($event)">
        <sbb-icon svgIcon="kom:face-worker-small"></sbb-icon> Copy
      </button>
      <button sbb-menu-item (click)="assignLastAction($event)">
        <sbb-icon svgIcon="kom:trash-small"></sbb-icon> Delete
      </button>
      <hr />
      <button sbb-menu-item (click)="assignLastAction($event)">
        <sbb-icon svgIcon="kom:cross-small"></sbb-icon> Cancel
      </button>
    </sbb-menu>
  `,
})
export class SbbMenuTestComponent {
  @ViewChild('dropdown') dropdown: SbbMenu;

  constructor() {
    this.dropdown.closed.subscribe();
  }

  closed($event: void) {}

  opened($event: void) {}

  optionSelected($event: SbbDropdownSelectedEvent) {}

  assignLastAction($event: any) {}
}

@NgModule({
  declarations: [SbbMenuTestComponent],
  imports: [SbbMenuModule, SbbIconModule],
})
export class ContextmenuTestModule {}

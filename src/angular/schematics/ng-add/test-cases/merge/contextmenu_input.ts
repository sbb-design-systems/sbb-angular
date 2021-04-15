import { Component, NgModule, ViewChild } from '@angular/core';
import { SbbContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbDropdown, SbbDropdownSelectedEvent } from '@sbb-esta/angular-public/dropdown';
import { SBB_DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@sbb-esta/angular-public/dropdown';

@Component({
  selector: 'sbb-contextmenu-test',
  template: `<sbb-contextmenu>
      <sbb-dropdown
        [autoActiveFirstOption]="true"
        [panelWidth]="20"
        [class]="'testclass'"
        (closed)="closed($event)"
        (opened)="opened($event)"
        (optionSelected)="optionSelected($event)"
        #dropdown
      >
        <button sbbDropdownItem (click)="assignLastAction($event)">
          <sbb-icon svgIcon="kom:face-worker-small"></sbb-icon> Copy
        </button>
        <button sbbDropdownItem (click)="assignLastAction($event)">
          <sbb-icon svgIcon="kom:trash-small"></sbb-icon> Delete
        </button>
        <hr />
        <button sbbDropdownItem (click)="assignLastAction($event)">
          <sbb-icon svgIcon="kom:cross-small"></sbb-icon> Cancel
        </button>
      </sbb-dropdown>
    </sbb-contextmenu>
    <sbb-contextmenu>
      <sbb-dropdown #menu="sbbDropdown"></sbb-dropdown>
    </sbb-contextmenu>
    <sbb-contextmenu>
      <sbb-dropdown #menu1></sbb-dropdown>
    </sbb-contextmenu>`,
})
export class SbbMenuTestComponent {
  @ViewChild('dropdown') dropdown: SbbDropdown;

  constructor() {}

  closed($event: void) {}

  opened($event: void) {}

  optionSelected($event: SbbDropdownSelectedEvent) {}

  assignLastAction($event: any) {}
}

@NgModule({
  declarations: [SbbMenuTestComponent],
  imports: [SbbContextmenuModule, SbbIconModule],
})
export class ContextmenuTestModule {}
